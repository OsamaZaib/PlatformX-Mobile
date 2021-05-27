import React, {FC} from 'react';
import {View, Text, StyleSheet, Platform, ScrollView} from 'react-native';
import CustomHeader from '../Components/CustomHeader';
import CustomSearch from '../Components/Search';
import PostCard from '../Components/PostCard';
import {postData} from '../Constants/sample';
import {darkColors} from '../Constants/Colors';

type props = {
  navigation: any;
};
const Workshop: FC<props> = ({navigation}) => {
  return (
    <View style={styles.parent}>
      <CustomHeader
        title={'Workshops'}
        navigation={navigation}
        drawer
        bell
        chat
      />

      <ScrollView>
        <CustomSearch placeholder={'Search Workshops'} />
        {postData.map(post => (
          <PostCard key={post.id} postDetail={post} />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {
    flex: 1,
    backgroundColor: darkColors.SCREEN_BACKGROUND_COLOR,
  },
});

export default Workshop;
