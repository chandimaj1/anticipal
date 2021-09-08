const React = require('react');

const plugins = require('../../utils/plugins');

const friendUtils = require('../utils/friend'),
      xprofileUtils = require('../utils/xprofile')();

const AvatarSmall = require('../avatar/AvatarSmall'),
      BadgeVerified = require('../badge/BadgeVerified'),
      BadgeItemList = require('../badge/BadgeItemList'),
      SocialLinkSmallList =  require('../social-link/SocialLinkSmallList'),
      SocialLinkSmall = require('../social-link/SocialLinkSmall'),
      IconSVG = require('../icon/IconSVG');

const AddFriendButton = require('../button/AddFriendButton'),
      WithdrawFriendRequestButton = require('../button/WithdrawFriendRequestButton'),
      AcceptFriendRequestButton = require('../button/AcceptFriendRequestButton'),
      RemoveFriendButton = require('../button/RemoveFriendButton'),
      ButtonLink = require('../button/ButtonLink');

class MemberPreviewSmall extends React.Component {
  constructor(props) {
    super(props);

    this.socialLinksSliderRef = React.createRef();
    this.socialLinksControlPrevRef = React.createRef();
    this.socialLinksControlNextRef = React.createRef();

    this.socialLinksSlider = undefined;
    this.socialLinksSlidesPerView = 4;
  }

  componentDidMount() {
    this.socialLinksSlider = plugins.createSlider(this.socialLinksSliderRef.current, {
      navigation: {
        prevEl: this.socialLinksControlPrevRef.current,
        nextEl: this.socialLinksControlNextRef.current
      },
      slidesPerView: this.socialLinksSlidesPerView,
      spaceBetween: 8
    });
  }

  componentWillUnmount() {
    if (this.socialLinksSlider) {
      // Destroy slider instance and detach all events listeners
      this.socialLinksSlider.destroy();
    }
  }

  render() {
    const socialLinks = [];

    if (this.props.data.profile_data.group.Social_Links) {
      for (const socialField of this.props.data.profile_data.group.Social_Links) {
        if (socialField.value !== '') {
          socialLinks.push({
            name: xprofileUtils.getURLIcon(socialField.name),
            link: socialField.value
          });
        }
      }
    }

    const friendable = friendUtils(this.props.loggedUser, this.props.data.id);

    const postCountText = this.props.data.stats.post_count === 1 ? vikinger_translation.post : vikinger_translation.posts,
          friendCountText = this.props.data.stats.friend_count === 1 ? vikinger_translation.friend : vikinger_translation.friends,
          commentCountText = this.props.data.stats.comment_count === 1 ? vikinger_translation.comment : vikinger_translation.comments;

    const displayVerifiedMemberBadge = vikinger_constants.plugin_active['bp-verified-member'] && vikinger_constants.settings.bp_verified_member_display_badge_in_members_lists && this.props.data.verified;

    return (
      <div className="user-preview landscape animate-slide-down">
        {/* USER PREVIEW COVER */}
        <div className="user-preview-cover" style={{background: `url(${this.props.data.cover_url}) center center / cover no-repeat`}}></div>
        {/* USER PREVIEW COVER */}
    
        {/* USER PREVIEW INFO */}
        <div className="user-preview-info">
          <div className="user-short-description landscape tiny">
            <AvatarSmall modifiers='user-short-description-avatar' data={this.props.data} />
      
            <p className="user-short-description-title">
              <a href={this.props.data.link}>{this.props.data.name}</a>
            {
              displayVerifiedMemberBadge && vikinger_constants.settings.bp_verified_member_display_badge_in_profile_fullname &&
                <BadgeVerified />
            }
            </p>
            <p className="user-short-description-text">
              <a href={this.props.data.link}>&#64;{this.props.data.mention_name}</a>
            {
              displayVerifiedMemberBadge && vikinger_constants.settings.bp_verified_member_display_badge_in_profile_username &&
                <BadgeVerified />
            }
            </p>
          </div>

          {
            vikinger_constants.gamipress_badge_type_exists &&
              <React.Fragment>
              {
                (this.props.data.badges.length > 0) &&
                  <BadgeItemList data={this.props.data.badges} maxDisplayCount={4} moreLink={this.props.data.badges_link} modifiers="small" />
              }
              {
                (this.props.data.badges.length === 0) &&
                  <p className="no-results-text">{vikinger_translation.no_badges_unlocked}</p>
              }
              </React.Fragment>
          }

          <div className="user-stats">
            <div className="user-stat">
              <p className="user-stat-title">{this.props.data.stats.post_count}</p>
              <p className="user-stat-text">{postCountText}</p>
            </div>
          {
            vikinger_constants.plugin_active.buddypress_friends &&
              <div className="user-stat">
                <p className="user-stat-title">{this.props.data.stats.friend_count}</p>
                <p className="user-stat-text">{friendCountText}</p>
              </div>
          }
            <div className="user-stat">
              <p className="user-stat-title">{this.props.data.stats.comment_count}</p>
              <p className="user-stat-text">{commentCountText}</p>
            </div>
          </div>

          {/* SOCIAL LINKS */}
          {
            (socialLinks.length > 0) && (socialLinks.length <= this.socialLinksSlidesPerView) &&
              <SocialLinkSmallList data={socialLinks} />
          }
          {
            (socialLinks.length > this.socialLinksSlidesPerView) &&
              <div className="user-preview-social-links-wrap">
                {/* USER PREVIEW SOCIAL LINKS SLIDER */}
                <div ref={this.socialLinksSliderRef} className="user-preview-social-links-slider swiper-container">
                  {/* USER PREVIEW SOCIAL LINKS */}
                  <div className="user-preview-social-links swiper-wrapper">
                    {
                      socialLinks.map((socialItem, i) => {
                        return (
                          <div key={i} className="user-preview-social-link swiper-slide">
                            <SocialLinkSmall data={socialItem} />
                          </div>
                        );
                      })
                    }
                  </div>
                  {/* USER PREVIEW SOCIAL LINKS */}
                </div>
                {/* USER PREVIEW SOCIAL LINKS SLIDER */}

                {/* SLIDER CONTROLS */}
                <div className="slider-controls">
                  {/* SLIDER CONTROL */}
                  <div ref={this.socialLinksControlPrevRef} className="slider-control left">
                    <IconSVG  icon="small-arrow"
                              modifiers="slider-control-icon"
                    />
                  </div>
                  {/* SLIDER CONTROL */}
            
                  {/* SLIDER CONTROL */}
                  <div ref={this.socialLinksControlNextRef} className="slider-control right">
                    <IconSVG  icon="small-arrow"
                              modifiers="slider-control-icon"
                    />
                  </div>
                  {/* SLIDER CONTROL */}
                </div>
                {/* SLIDER CONTROLS */}
              </div>
          }
          {/* SOCIAL LINKS */}

          {
            (socialLinks.length === 0) &&
              <p className="no-results-text no-results-social">{vikinger_translation.no_social_networks_linked}</p>
          }

        {/* USER PREVIEW ACTIONS */}
        {
          vikinger_constants.plugin_active.buddypress_friends &&
            <div className="user-preview-actions">
            {
              this.props.loggedUser && (this.props.loggedUser.id !== this.props.data.id) &&
                <React.Fragment>
                {
                  !friendable.isFriend() && !friendable.friendRequestSent() && !friendable.friendRequestReceived() &&
                    <AddFriendButton  modifiers="secondary"
                                      icon="add-friend"
                                      title={vikinger_translation.add_friend}
                                      loggedUser={this.props.loggedUser}
                                      userID={this.props.data.id}
                                      onActionComplete={this.props.onActionComplete}
                    />
                }

                {
                  !friendable.isFriend() && friendable.friendRequestSent() &&
                    <WithdrawFriendRequestButton  modifiers="tertiary"
                                                  icon="remove-friend"
                                                  title={vikinger_translation.withdraw_friend}
                                                  loggedUser={this.props.loggedUser}
                                                  userID={this.props.data.id}
                                                  onActionComplete={this.props.onActionComplete}
                    />
                }

                {
                  !friendable.isFriend() && friendable.friendRequestReceived() &&
                    <AcceptFriendRequestButton  modifiers="secondary"
                                                icon="add-friend"
                                                title={vikinger_translation.accept_friend}
                                                loggedUser={this.props.loggedUser}
                                                userID={this.props.data.id}
                                                onActionComplete={this.props.onActionComplete}
                    />
                }

                {
                  friendable.isFriend() &&
                    <RemoveFriendButton modifiers="tertiary"
                                        icon="remove-friend"
                                        title={vikinger_translation.remove_friend}
                                        loggedUser={this.props.loggedUser}
                                        userID={this.props.data.id}
                                        onActionComplete={this.props.onActionComplete}
                    />
                }

                {
                  vikinger_constants.plugin_active.buddypress_messages && friendable.isFriend() &&
                    <ButtonLink modifiers="primary"
                                title={vikinger_translation.send_message}
                                icon="messages"
                                link={`${this.props.loggedUser.messages_link}?user_id=${this.props.data.id}`}
                    />
                }
                </React.Fragment>
            }
            </div>
        }
        {/* USER PREVIEW ACTIONS */}
        </div>
        {/* USER PREVIEW INFO */}
      </div>
    );
  }
}

module.exports = MemberPreviewSmall;