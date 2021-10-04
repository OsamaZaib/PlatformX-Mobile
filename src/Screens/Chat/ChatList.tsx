import React, {FC, useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  RefreshControl,
  ToastAndroid,
  TouchableOpacity,
} from 'react-native';
import CustomHeader from '../../Components/CustomHeader';
import ChatCard from './ChatCard';
import {Sizes} from '../../Constants/Size';
import {useStateValue} from '../../Store/StateProvider';
import axios from '../../Utils/Axios';
import CustomSearch from '../../Components/Search';
import PostSkeleton from '../../Skeleton/PostCardSkeleton';

type props = {
  navigation: any;
};

const Chat: FC<props> = ({navigation}) => {
  const [refreshing, setRefreshing] = useState(false);
  const [ChatList, setChatList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [{theme}, dispatch] = useStateValue();
  const [Searching, setSearching] = useState<{
    isSearching: boolean;
    query: string;
  }>({
    isSearching: false,
    query: '',
  });

  const getChatList = async () => {
    try {
      const response = await axios.get('/chat/list/');
      setChatList(response.data);
      setIsLoading(false);
    } catch (error: any) {
      ToastAndroid.show(error.data.response.error, 1500);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    getChatList().then(() => setRefreshing(false));
  };

  const handleSearch = () => {
    console.log('Handling search');
  };

  useEffect(() => {
    getChatList();
    return () => {
      setIsLoading(true);
      setChatList([]);
    };
  }, []);
  return (
    <View style={styles.parent}>
      <CustomHeader
        navigation={navigation}
        title={'Chat'}
        back
        onBackPress={() => navigation.goBack()}
      />

      {!isLoading && (
        <CustomSearch
          placeholder={'Search chats'}
          showFilterIcon={false}
          handleSearch={handleSearch}
        />
      )}

      {/* if searching  then show post skeleton without search skeleton*/}
      {Searching.isSearching ? (
        <>
          <PostSkeleton showSearchSkeleton={!Searching.isSearching} />
        </>
      ) : ChatList.length > 0 ? (
        <ScrollView
          style={styles.scrollViewContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[theme.TEXT_COLOR]}
              progressBackgroundColor={theme.SHADOW_COLOR}
              progressViewOffset={20}
              size={Sizes.large}
            />
          }>
          <>
            {ChatList.map((chat: any) => (
              <ChatCard chat={chat} navigation={navigation} key={chat.id} />
            ))}
          </>
        </ScrollView>
      ) : !isLoading && ChatList.length === 0 ? (
        <>
          <View style={styles.center}>
            <Text
              style={[
                styles.noMoreText,
                {
                  color: theme.TEXT_COLOR,
                },
              ]}>
              {Searching.query !== '' && ChatList.length === 0
                ? `No result Found for ${Searching.query}`
                : 'No posts yet'}
            </Text>
            <TouchableOpacity onPress={() => setIsLoading(true)}>
              <Text style={[styles.refreshText, {color: theme.TOMATO_COLOR}]}>
                Refresh
              </Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <PostSkeleton
          showSearchSkeleton={!Searching.isSearching || refreshing}
        />
      )}
    </View>
  );
};

export default Chat;

const styles = StyleSheet.create({
  parent: {
    flex: 1,
  },
  scrollViewContainer: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noMoreText: {
    fontSize: Sizes.normal,
  },
  refreshText: {
    fontSize: Sizes.normal,
  },
});
