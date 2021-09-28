import React, {FC, useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  ToastAndroid,
} from 'react-native';
import HackathonCard from '../../Components/HackathonCard';
import CustomHeader from '../../Components/CustomHeader';
import CustomSearch from '../../Components/Search';
import axios from '../../Utils/Axios';
import {Sizes} from '../../Constants/Size';
import HackathonSkeleton from '../../Skeleton/HackathonCardSkeleton';
import {useStateValue} from '../../Store/StateProvider';

type props = {
  navigation: any;
};

const Hackathons: FC<props> = ({navigation}) => {
  const [Hackathon, setHackathons] = useState([]);
  const [Refreshing, setRefreshing] = useState(false);
  const [IsLoading, setIsLoading] = useState(true);
  const [{theme}, dispatch] = useStateValue();
  const [Searching, setSearching] = useState<{
    isSearching: boolean;
    query: string;
  }>({
    isSearching: false,
    query: '',
  });

  const getData = async () => {
    axios
      .get('/api/hackathons/')
      .then(response => {
        setHackathons(response.data);
        setIsLoading(false);
      })
      .catch(error => {
        setIsLoading(false);
        console.log('Error is', error);
      });
  };

  const onRefresh = () => {
    setRefreshing(true);
    getData().then(() => {
      // console.log(Post);
      setRefreshing(false);

      // handle seaching state
      setSearching({
        isSearching: false,
        query: '',
      });
    });
  };

  const handleSearch = (query: string) => {
    // set the searching to true
    setSearching({
      isSearching: true,
      query: query,
    });
    try {
      axios.get(`/api/hackathon/search/?q=${query}`).then(response => {
        setHackathons(response.data);
        setIsLoading(false);
        setSearching(props => {
          return {
            isSearching: false,
            query: props.query,
          };
        });
      });
    } catch (error: any) {
      setSearching(props => {
        return {
          isSearching: false,
          query: props.query,
        };
      });
      ToastAndroid.show(error.data.response.error, 1500);
    }
  };

  const applyFilters = (
    filter: Array<{subtag: Array<string>; tag: string}>,
  ) => {
    // make query string to be included in api call
    let query = '';
    // only if filter is not empty
    if (filter.length > 0) {
      for (let i = 0; i < filter.length; i++) {
        // get tag
        const tag = filter[i].tag.toLowerCase();
        // get subtags
        filter[i].subtag.forEach(subtag => {
          // add tag and subtag in query string if subtag is not empty
          if (subtag !== '') {
            if (query === '') {
              query += `${tag}=${subtag.toLowerCase()}`;
            } else {
              // append & if query is not empty
              query += `&${tag}=${subtag.toLowerCase()}`;
            }
          }
        });
      }
    }
    if (query !== '') {
      // call the api if query is not empty
      try {
        axios.get(`/api/hackathon/search/?q=${query}`).then(response => {});
      } catch (error) {}
    }
  };

  useEffect(() => {
    getData();
  }, [IsLoading]);

  return (
    <View
      style={[
        styles.parent,
        {
          backgroundColor: theme.SCREEN_BACKGROUND_COLOR,
        },
      ]}>
      <CustomHeader
        title={'Hackathons'}
        navigation={navigation}
        drawer
        chat
        bell
      />

      {!IsLoading && (
        <CustomSearch
          placeholder={'Search hackathons'}
          showFilterIcon={true}
          handleSearch={handleSearch}
          applyFilters={applyFilters}
        />
      )}

      {Searching.isSearching ? (
        <>
          <HackathonSkeleton showSearchSkeleton={!Searching.isSearching} />
        </>
      ) : Hackathon.length > 0 ? (
        <>
          <FlatList
            data={Hackathon}
            // disableVirtualization
            keyExtractor={(item: any, index) => `${item.id}-${index}`}
            renderItem={({item: hackathon, index}: any) => {
              return (
                <HackathonCard
                  key={hackathon?.id}
                  hackathonDetail={hackathon}
                  navigation={navigation}
                />
              );
            }}
            // progressViewOffset={10}
            refreshControl={
              <RefreshControl
                refreshing={Refreshing}
                onRefresh={onRefresh}
                colors={[theme.TEXT_COLOR]}
                progressBackgroundColor={theme.SHADOW_COLOR}
                progressViewOffset={20}
                size={Sizes.large}
              />
            }
            // contentOffset={{y: -300, x: 0}}
          />
        </>
      ) : !IsLoading && Hackathon.length === 0 ? (
        <View style={styles.center}>
          <Text style={[styles.noMoreText, {color: theme.TEXT_COLOR}]}>
            {Searching.query !== '' && Hackathon.length === 0
              ? `No result Found for ${Searching.query}`
              : 'No hackathons yet'}
          </Text>
          <TouchableOpacity onPress={() => setIsLoading(true)}>
            <Text style={[styles.refreshText, {color: theme.TOMATO_COLOR}]}>
              Refresh
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <HackathonSkeleton showSearchSkeleton={!Searching.isSearching} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {
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

export default Hackathons;
