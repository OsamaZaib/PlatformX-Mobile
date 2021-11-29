/* eslint-disable react-native/no-inline-styles */
import React, {FC, useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  FlatList,
  RefreshControl,
  ToastAndroid,
  Image,
  Linking,
} from 'react-native';
import CustomButton from '../../Components/CustomButton';
import CustomHeader from '../../Components/CustomHeader';
// import Loading from '../../Components/Loading';
import Skeleton from '../../Skeleton/CardSkeleton';
import {GREY_IMAGE} from '../../Constants/sample';
import {Sizes, Width} from '../../Constants/Size';
import {useStateValue} from '../../Store/StateProvider';
import axios from '../../Utils/Axios';

type Props = {
  id: number;
  title: string;
  content: string;
  image: string;
  url: string;
};

const Card: FC<Props> = ({id, title, image, content, url}) => {
  const {theme} = useStateValue()[0];
  const [poster, setPoster] = useState({
    loading: true,
    ratio: 0,
  });

  const VisitSite = () => {
    Linking.openURL(url);
  };

  return (
    <View
      style={[
        styles.container,
        styles.cardContainer,
        {
          backgroundColor: theme.CARD_BACKGROUND_COLOR,
        },
      ]}>
      {/* topic container  */}
      <View style={[styles.topicContainer, styles.center]}>
        {/* name of the project  */}
        <View style={styles.topicTextContainer}>
          <Text style={[styles.topicText, {color: theme.TEXT_COLOR}]}>
            {title}
          </Text>
        </View>
      </View>
      {/* image container  */}
      <View style={[styles.imageContainer, styles.center]}>
        <Image
          source={{
            uri: poster.loading ? GREY_IMAGE : image,
          }}
          onLoadEnd={() => {
            Image.getSize(image, (width, heigth) => {
              // calculate aspect ratio of image
              setPoster(props => {
                return {
                  loading: false,
                  ratio: heigth / width,
                };
              });
            });
          }}
          style={{
            width: Width * 0.78,
            height: Width * poster.ratio * 0.78,
            borderRadius: 10,
          }}
          resizeMode={'contain'} //contain
        />
      </View>
      {/* content container  */}
      <View style={[styles.container, styles.contentContainer]}>
        <Text style={[styles.contentText, {color: theme.TEXT_COLOR}]}>
          {content}
        </Text>
      </View>
      <View style={[{marginRight: 8, alignItems: 'flex-end'}]}>
        <CustomButton
          text={'Visit Site'}
          onPress={VisitSite}
          width={Width * 0.2}
          height={Width * 0.09}
          textSize={Sizes.normal * 0.8}
        />
      </View>
    </View>
  );
};

type props = {
  navigation: any;
};

const Articles: FC<props> = ({navigation}) => {
  const {theme} = useStateValue()[0];
  const [articles, setArticles] = useState([]);
  const [Refreshing, setRefreshing] = useState(false);
  const [loading, setloading] = useState(true);

  const getArticles = async () => {
    axios
      .get('/user/articles/')
      .then(response => {
        setloading(false);
        setArticles(response.data.data);
      })
      .catch(error => {
        setloading(false);
        if (error.response) {
          ToastAndroid.show(error.response.data.error, 1500);
        }
        return error.response;
      });
  };
  const onRefresh = () => {
    setRefreshing(true);
    getArticles().then(() => {
      setRefreshing(false);
    });
  };

  useEffect(() => {
    getArticles();
  }, []);
  return (
    <View
      style={[styles.parent, {backgroundColor: theme.SCREEN_BACKGROUND_COLOR}]}>
      <CustomHeader
        title={'Read Articles'}
        navigation={navigation}
        back
        onBackPress={() => navigation.goBack()}
      />

      {!loading ? (
        <>
          <View style={styles.margin}>
            <View style={styles.container} key={Math.random()}>
              <Text style={[styles.smallText, {color: theme.DIM_TEXT_COLOR}]}>
                Read articles based on your interests. You can always change
                your interests by editing them on your profile.
              </Text>
            </View>
          </View>

          <FlatList
            data={articles}
            contentContainerStyle={styles.scroll}
            keyExtractor={(item, index) => `${index}`}
            renderItem={({item, index}) => <Card {...item} />}
            refreshControl={
              <RefreshControl
                refreshing={Refreshing}
                onRefresh={onRefresh}
                colors={[theme.REFRESH_COLOR]}
                progressBackgroundColor={theme.REFRESHING_BACKGROUND_COLOR}
                progressViewOffset={20}
                size={Sizes.large}
              />
            }
          />
        </>
      ) : (
        <View style={{flex: 1}}>
          <Skeleton />
        </View>
      )}
    </View>
  );
};

export default Articles;

const styles = StyleSheet.create({
  parent: {
    flex: 1,
  },
  scroll: {
    marginHorizontal: Width * 0.04,
    marginBottom: 10,
  },
  margin: {
    marginHorizontal: Width * 0.04,
  },
  container: {
    marginTop: 10,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  smallText: {
    fontSize: Sizes.normal * 0.66,
  },
  normalText: {
    fontSize: Sizes.normal,
  },
  cardContainer: {
    borderRadius: 10,
    shadowOpacity: 1,
    shadowRadius: 25,
    shadowOffset: {width: 10, height: 12},
    elevation: 5,
  },
  topicContainer: {
    marginBottom: 10,
    marginTop: 10,
    flex: 1,
    flexDirection: 'row',
  },
  topicTextContainer: {
    alignItems: 'center',
  },
  topicText: {
    fontSize: Sizes.normal * 1.2,
    textAlign: 'center',
  },
  imageContainer: {
    marginHorizontal: 0,
    marginTop: 10,
  },
  contentContainer: {
    marginHorizontal: Width * 0.04,
  },
  contentText: {
    fontSize: Sizes.normal * 0.8,
    textAlign: 'center',
  },
});
