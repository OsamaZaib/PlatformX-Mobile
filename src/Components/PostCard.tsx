import React, {FC, useState} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {Width, Height, Sizes} from '../Constants/Size';
import {darkColors} from '../Constants/Colors';
import PostModal from '../Modals/CommentModal';

const MAX_TEXT_LENGTH = 290;
const RANDOM_IMAGE =
  'https://conservation-innovations.org/wp-content/uploads/2019/09/Dummy-Person.png';

type Props = {
  setisModalOpen: any;
};
const PostCardButtons: FC<Props> = ({setisModalOpen}) => {
  return (
    <View style={styles.postButtonContainer}>
      <TouchableOpacity
        onPress={() => console.log('Pressed on like button')}
        style={styles.PostButton}>
        <Text style={styles.PostButtonText}>Like</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setisModalOpen(true)}
        style={styles.PostButton}>
        <Text style={styles.PostButtonText}>Comment</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => console.log('Pressed on share button')}
        style={styles.PostButton}>
        <Text style={styles.PostButtonText}>Share</Text>
      </TouchableOpacity>
    </View>
  );
};

type props = {
  postDetail: any;
};

const PostCard: FC<props> = ({postDetail}) => {
  const [isModalOpen, setisModalOpen] = useState(false);
  const [ImageLoading, setImageLoading] = useState(true);
  return (
    <View style={styles.parent}>
      <PostModal
        isShow={isModalOpen}
        toggleModal={() => setisModalOpen(!isModalOpen)}
        comments={postDetail.comments}
      />
      {/* header  */}
      <View style={styles.headerContainer}>
        <View style={styles.headerImageContainer}>
          <Image
            source={{uri: ImageLoading ? RANDOM_IMAGE : postDetail.image}}
            style={styles.userImage}
            onLoad={() => setImageLoading(false)}
          />
        </View>
        <View style={styles.headerTextContainer}>
          <Text style={styles.username}>{postDetail.user_name}</Text>
          <Text style={styles.date}>
            {postDetail.date.toUTCString().substring(0, 17)}
          </Text>
        </View>
      </View>
      {/* content  */}
      <View style={styles.contentContainer}>
        <Text style={styles.descriptionText}>
          {postDetail.description.length > MAX_TEXT_LENGTH
            ? postDetail.description.substring(0, MAX_TEXT_LENGTH - 4) +
              '.... read more'
            : postDetail.description}
        </Text>
      </View>
      {/* image if any  */}
      {postDetail.post_image && (
        <View style={styles.imageContainer}>
          <Image
            source={{uri: postDetail.post_image}}
            style={styles.postImage}
            resizeMode={'contain'}
          />
        </View>
      )}
      {/* like comment share details */}
      <TouchableOpacity
        style={styles.numberContainer}
        onPress={() => setisModalOpen(true)}>
        <View style={styles.likeContainer}>
          <Text style={styles.PostButtonText}>{postDetail.likes} Likes</Text>
        </View>
        <View style={styles.commentConatiner}>
          <Text style={styles.PostButtonText}>
            {postDetail.comments.length} Comment
          </Text>
        </View>
        <View style={styles.sharContainer}>
          <Text style={styles.PostButtonText}>{postDetail.shares} Share</Text>
        </View>
      </TouchableOpacity>
      {/* post buttons   */}
      <PostCardButtons setisModalOpen={setisModalOpen} />
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {
    marginHorizontal: Width * 0.04,
    marginVertical: Width * 0.01,
    // minHeight: Height * 0.35,
    // maxHeight: Height * 0.4,
    borderRadius: 20,
    // padding: 5,
    shadowColor: darkColors.SHADOW_COLOR,
    backgroundColor: darkColors.LIGHT_BACKGROUND,
    shadowOpacity: 1,
    shadowRadius: 25,
    shadowOffset: {width: 10, height: 12},
    elevation: 30,
  },
  headerContainer: {
    minHeight: Height * 0.08,
    maxHeight: Height * 0.15,
    borderBottomColor: darkColors.SHADOW_COLOR,
    borderBottomWidth: 2,
    flexDirection: 'row',
    padding: 7,
  },
  headerImageContainer: {
    // width: Width * 0.3,
    flex: 2,
  },
  userImage: {
    height: Height * 0.07,
    width: Width * 0.14,
    borderRadius: 40,
  },
  headerTextContainer: {
    // width: Width * 0.6,
    flex: 8,
    flexDirection: 'column',
  },
  username: {
    color: darkColors.TEXT_COLOR,
    fontSize: Sizes.large * 0.9,
    fontWeight: 'bold',
  },
  date: {
    color: darkColors.TEXT_COLOR,
    fontSize: Sizes.normal * 0.75,
  },
  contentContainer: {
    // minHeight: Height * 0.15,
    maxHeight: Height * 0.2,
    marginVertical: 7,
    // padding: 7,
    paddingHorizontal: 7,
  },
  descriptionText: {
    color: darkColors.TEXT_COLOR,
    fontSize: Sizes.normal,
  },
  imageContainer: {
    // width: Width * 0.961,
    // minHeight: Height * 0.25,
    // maxHeight: Height * 0.3,
    // height: 'auto',
    marginHorizontal: 0,
    // flex: 1,
    height: Width * (9 / 16),
    // justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'red',
  },
  postImage: {
    // width: Width * 0.7,
    // minHeight: Height * 0.2,
    // maxHeight: Height * 0.4,
    // width: Width * 0.95,
    // flex: 1,
    // aspectRatio: 1,
    width: Width * 0.9,
    height: Width * (9 / 16),
    // flex: 1,
    // minHeight: Width,
    // width: '100%',
    // height: 'auto',
    // height: Height * 0.3,
    // aspectRatio: 1,
    // maxHeight: Width,
  },
  numberContainer: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    // borderTopWidth: 2,
    padding: 5,
    paddingVertical: 6,
    borderColor: darkColors.SHADOW_COLOR,
    // marginTop: 10,
  },
  likeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentConatiner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sharContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postButtonContainer: {
    height: Height * 0.06,
    flexDirection: 'row',
    marginVertical: Height * 0.009,
    padding: 5,
  },
  PostButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: darkColors.SHADOW_COLOR,
    marginHorizontal: Width * 0.008,
    borderRadius: 10,
  },
  PostButtonText: {
    fontSize: Sizes.small,
    color: darkColors.TEXT_COLOR,
  },
});

export default PostCard;
