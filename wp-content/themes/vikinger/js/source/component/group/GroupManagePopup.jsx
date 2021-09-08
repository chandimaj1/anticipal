const React = require('react');

const app = require('../../utils/core'),
      plugins = require('../../utils/plugins');

const WP_Router = require('../../router/WP_Router')();

const UserGroupPreview = require('../user-preview/UserGroupPreview'),
      FormInput = require('../form/FormInput'),
      FormInputCheckbox = require('../form/FormInputCheckbox'),
      FormSelect = require('../form/FormSelect'),
      FormTextarea = require('../form/FormTextarea'),
      UploadBox = require('../upload/UploadBox'),
      Loader = require('../loader/Loader'),
      LoaderSpinnerSmall = require('../loader/LoaderSpinnerSmall'),
      GroupMemberStatusList = require('../user-status/GroupMemberStatusList');

const FormRow = require('../form/FormRow');

class GroupManagePopup extends React.Component {
  constructor(props) {
    super(props);

    this.creating = !this.props.data;

    this.popupBoxStyles = !this.creating ? {minHeight: '526px'} : {};

    this.defaultGroupData = {
      name: vikinger_translation.create_new_group,
      status: 'public',
      avatar_url: this.props.loggedUser.default_group_avatar_url,
      cover_image_url: this.props.loggedUser.default_group_cover_image_url,
      enable_forum: false
    };

    this.groupData = {
      name: '',
      status: 'public',
      description: '',
      enable_forum: false
    };

    this.groupStatusOptions = [
      {
        id: 'public',
        name: vikinger_translation.public
      },
      {
        id: 'private',
        name: vikinger_translation.private
      }
    ];

    this.forum = {
      post_title: '',
      post_content: '',
      post_status: 'publish'
    };

    this.forumPrivacyOptions = [
      {
        id: 'publish',
        name: 'Public'
      },
      {
        id: 'private',
        name: 'Private'
      },
      {
        id: 'hidden',
        name: 'Hidden'
      }
    ];

    this.groupMeta = this.getCustomGroupMeta();

    this.initialTab = 'group-info';

    // if editing group
    if (!this.creating) {
      // if logged user is not the creator of the group
      if (this.props.data.creator_id !== this.props.loggedUser.id) {
        // if logged user is an admin or mod of the group, show members screen
        if (this.props.data.is_admin || this.props.data.is_mod) {
          this.initialTab = 'group-members';
        }
      }
    }

    this.state = {
      activeTab: this.initialTab,
      avatarFile: false,
      coverFile: false,
      uploadAvatarTitle: vikinger_translation.change_avatar,
      uploadAvatarActive: false,
      uploadCoverTitle: vikinger_translation.change_cover,
      uploadCoverActive: false,
      group: this.creating ? this.defaultGroupData : false,
      groupData: this.groupData,
      groupMeta: this.groupMeta,
      groupMetaToUpdate: {},
      markRequired: false,
      saving: false,
      error: false,
      deleting: false,
      deleteError: false,
      forum: this.forum
    };

    this.groupManagePopupRef = React.createRef();

    this.getGroupData = this.getGroupData.bind(this);

    this.handleChange = this.handleChange.bind(this);
    this.updateAvatarFile = this.updateAvatarFile.bind(this);
    this.updateCoverFile = this.updateCoverFile.bind(this);
    this.updateSocialMeta = this.updateSocialMeta.bind(this);
    this.deleteGroup = this.deleteGroup.bind(this);

    this.toggleForumActive = this.toggleForumActive.bind(this);
    this.handleForumChange = this.handleForumChange.bind(this);

    this.setActiveTab = this.setActiveTab.bind(this);

    this.discardAll = this.discardAll.bind(this);
    this.save = this.save.bind(this);
  }

  getGroupData() {
    const getGroupsPromise = WP_Router.getGroups({include: [this.props.data.id], data_scope: 'group-manage'});

    getGroupsPromise
    .done((response) => {
      // console.log('GROUP MANAGE POPUP - GET GROUP DATA RESPONSE: ', response);

      const group = response[0];

      this.groupMeta = this.getCustomGroupMeta(group);

      this.groupData.name = group.name;
      this.groupData.status = group.status;
      this.groupData.description = group.description;
      this.groupData.enable_forum = group.enable_forum;

      // only fetch group associated forum if bbPress is active and the forums option is enabled
      if (!this.creating && vikinger_constants.plugin_active.bbpress && vikinger_constants.settings['bbp_is_group_forums_active']) {
        this.getGroupAssociatedForum();
      }

      this.setState((state, props) => {
        const forum = app.deepMerge(state.forum);

        const groupForumStatus = {
          public: 'publish',
          private: 'private',
          hidden: 'hidden'
        };

        forum.post_title = group.name;
        forum.post_content = group.description;
        forum.post_status = groupForumStatus[group.status];

        return {
          group: group,
          groupMeta: this.groupMeta,
          forum: forum
        };
      });
    })
    .fail((error) => {
      // console.log('GROUP MANAGE POPUP - GET GROUP DATA ERROR: ', error);
    });
  }

  getCustomGroupMeta(data) {
    const customGroupMeta = {
      social: [
        {
          name: 'Facebook',
          value: '',
          type: 'url'
        },
        {
          name: 'Twitter',
          value: '',
          type: 'url'
        },
        {
          name: 'Instagram',
          value: '',
          type: 'url'
        },
        {
          name: 'Youtube',
          value: '',
          type: 'url'
        },
        {
          name: 'Twitch',
          value: '',
          type: 'url'
        },
        {
          name: 'Discord',
          value: '',
          type: 'url'
        },
        {
          name: 'Patreon',
          value: '',
          type: 'url'
        },
        {
          name: 'Linkedin',
          value: '',
          type: 'url'
        },
        {
          name: 'Pinterest',
          value: '',
          type: 'url'
        },
        {
          name: 'Tiktok',
          value: '',
          type: 'url'
        },
        {
          name: 'Github',
          value: '',
          type: 'url'
        },
        {
          name: 'Reddit',
          value: '',
          type: 'url'
        },
        {
          name: 'Dribbble',
          value: '',
          type: 'url'
        }
      ]
    };

    if (data) {
      for (const customGroupMetaGroupKey in customGroupMeta) {
        const customGroupMetaGroup = customGroupMeta[customGroupMetaGroupKey];

        for (const customGroupMetaField of customGroupMetaGroup) {
          if (typeof data.meta[customGroupMetaField.name] !== 'undefined') {
            customGroupMetaField.value = data.meta[customGroupMetaField.name];
          }
        }
      }
    }

    return customGroupMeta;
  };

  handleChange(e) {
    this.setState((state, props) => {
      const groupData = app.deepMerge(state.groupData, {[e.target.name]: e.target.value});

      // console.log('GROUP MANAGE POPUP - HANDLE CHANGE UPDATED GROUP DATA: ', groupData);

      const group = app.deepMerge(state.group);

      if (e.target.name === 'status') {
        group.status = e.target.value;
      }

      return {
        groupData: groupData,
        group: group
      };
    });
  }

  getGroupAssociatedForum() {
    const getGroupAssociatedForumPromise = WP_Router.getGroupAssociatedForum({group_id: this.props.data.id});

    getGroupAssociatedForumPromise
    .done((response) => {
      // console.log('GROUP MANAGE POPUP - GET GROUP ASSOCIATED FORUM RESPONSE: ', this.props.data.id, response);

      if (response && response.length > 0) {
        this.setState((state, props) => {
          const forum = app.deepMerge(state.forum);

          forum.ID = response[0].ID;
          forum.post_title = response[0].post_title;
          forum.post_content = response[0].post_content;
          forum.post_status = response[0].post_status;

          return {
            forum: forum
          };
        }, () => {
          // console.log('GROUP MANAGE POPUP - GET GROUP ASSOCIATED FORUM STATE: ', this.state.forum);
        });
      }
    })
    .fail((error) => {
      // console.log('GROUP MANAGE POPUP - GET GROUP ASSOCIATED FORUM ERROR: ', error);
    });
  }

  handleForumChange(e) {
    this.setState((state, props) => {
      const forum = app.deepMerge(state.forum, {[e.target.name]: e.target.value});

      return {
        forum: forum
      };
    }, () => {
      // console.log('GROUP MANAGE POPUP - HANDLE FORUM CHANGE UPDATED DATA: ', this.state.forum);
    });
  }

  toggleForumActive() {
    this.setState((state, props) => {
      const groupData = app.deepMerge(state.groupData),
            group = app.deepMerge(state.group);

      groupData.enable_forum = !groupData.enable_forum;
      group.enable_forum = !group.enable_forum;

      return {
        groupData: groupData,
        group: group
      };
    }, () => {
      // console.log('GROUP MANAGE POPUP - TOGGLE FORUM ACTIVE UPDATED GROUP DATA: ', this.state.groupData);
    });
  }

  setActiveTab(tab) {
    this.setState({
      activeTab: tab
    });
  }

  updateAvatarFile(file) {
    // console.log('GROUP MANAGE POPUP - AVATAR FILE: ', file);

    this.setState((state, props) => {
      const group = app.deepMerge(state.group);

      group.avatar_url = file.url;

      return {
        avatarFile: file,
        uploadAvatarTitle: file.file.name,
        uploadAvatarActive: true,
        group: group
      };
    });
  }

  updateCoverFile(file) {
    // console.log('GROUP MANAGE POPUP - COVER FILE: ', file);

    this.setState((state, props) => {
      const group = app.deepMerge(state.group);

      group.cover_image_url = file.url;

      return {
        coverFile: file,
        uploadCoverTitle: file.file.name,
        uploadCoverActive: true,
        group: group
      };
    });
  }

  updateSocialMeta(field, data) {
    // console.log('GROUP MANAGE POPUP - SOCIAL FIELD UPDATE: ', field, data);

    this.setState((state, props) => {
      const groupMetaToUpdate = app.deepMerge(state.groupMetaToUpdate),
            groupMeta = app.deepMerge(state.groupMeta);

      groupMetaToUpdate[field.name] = data.target.value;

      for (const socialMeta of groupMeta.social) {
        if (socialMeta.name === field.name) {
          socialMeta.value = data.target.value;
          break;
        }
      }

      return {
        groupMeta: groupMeta,
        groupMetaToUpdate: groupMetaToUpdate
      };
    });
  }

  discardAll() {
    // console.log('GROUP MANAGE POPUP - DISCARD ALL: ', this.state);

    this.setState({
      groupData: this.groupData,
      groupMeta: this.groupMeta,
      groupMetaToUpdate: {},
      markRequired: false,
      avatarFile: false,
      coverFile: false,
      uploadAvatarTitle: vikinger_translation.change_avatar,
      uploadAvatarActive: false,
      uploadCoverTitle: vikinger_translation.change_cover,
      uploadCoverActive: false,
      error: false,
      deleteError: false
    });
  }

  getGroupDataUpdatedFields() {
    // group updated fields
    const updatedFields = {};

    // only update group data if it changed
    for (const groupField in this.state.groupData) {
      // if group field value changed from the original value, add it to update it
      if (this.state.groupData[groupField] !== this.groupData[groupField]) {
        updatedFields[groupField] = this.state.groupData[groupField];
      }
    }

    return Object.keys(updatedFields).length > 0 ? updatedFields : false;
  }

  deleteGroup() {
    // if already deleting, return
    if (this.state.deleting) {
      return;
    }

    this.setState({
      deleting: true
    });

    const deleteGroupPromise = WP_Router.deleteGroup(this.props.data.id);

    deleteGroupPromise
    .done((response) => {
      // console.log('GROUP MANAGE POPUP - GROUP DELETE RESPONSE: ', response);

      // refresh
      window.location.reload();
    })
    .fail((error) => {
      // console.log('GROUP MANAGE POPUP - GROUP DELETE ERROR: ', error);

      this.setState({
        deleting: false,
        deleteError: true
      });
    });
  }

  save() {
    // console.log('GROUP MANAGE POPUP - SAVE: ', this.state);

    // if already saving, return
    if (this.state.saving) {
      return;
    }

    this.setState({
      markRequired: false,
      saving: true
    });

    // if creating a group
    if (this.creating) {
      // console.log('GROUP MANAGE POPUP - CREATING');

      // if required fields have no value, show message and return
      if ((this.state.groupData.name === '') || (this.state.groupData.description === '')) {
        this.setState({
          markRequired: true,
          saving: false
        });

        // console.log('GROUP MANAGE POPUP - MISSING REQUIRED FIELDS');

        return;
      }

      // create group
      const groupData = app.deepMerge(this.state.groupData, {creator_id: this.props.loggedUser.id}),
            createGroupPromise = WP_Router.createGroup(groupData);

      // console.log('GROUP MANAGE POPUP - CREATE GROUP WITH DATA: ', groupData);

      createGroupPromise.done((response) => {
        // console.log('GROUP MANAGE POPUP - CREATE GROUP RESPONSE: ', response);

        let uploadAvatarPromise = {no_result: true},
            uploadCoverPromise = {no_result: true},
            updateGroupMetaPromise = {no_result: true};

        const avatarChanged = this.state.avatarFile,
              coverChanged = this.state.coverFile,
              groupMetaChanged = Object.keys(this.state.groupMetaToUpdate).length > 0;

        // if avatar, cover or group meta changed, save them
        if (avatarChanged || coverChanged || groupMetaChanged) {
          const createdGroupID = response.data[0].id;

          // if user changed avatar, save it
          if (avatarChanged) {
            uploadAvatarPromise = WP_Router.uploadGroupAvatar({
              group_id: createdGroupID,
              file: this.state.avatarFile.file
            });
          }

          // if user changed cover, save it
          if (coverChanged) {
            uploadCoverPromise = WP_Router.uploadGroupCover({
              group_id: createdGroupID,
              file: this.state.coverFile.file
            });
          }

          // if user updated group meta, save it
          if (groupMetaChanged) {
            updateGroupMetaPromise = WP_Router.updateGroupMetaFields({
              group_id: createdGroupID,
              fields: this.state.groupMetaToUpdate
            });
          }

          jQuery
          .when(uploadAvatarPromise, uploadCoverPromise, updateGroupMetaPromise)
          .done((avatarUploadResponse, coverUploadResponse, updateGroupMetaResponse) => {
            // console.log('GROUP MANAGE POPUP - AVATAR UPLOAD RESPONSE:', avatarUploadResponse);
            // console.log('GROUP MANAGE POPUP - COVER UPLOAD RESPONSE:', coverUploadResponse);
            // console.log('GROUP MANAGE POPUP - GROUP META UPDATE RESPONSE:', updateGroupMetaResponse);
          })
          .fail((error) => {
            // console.log('GROUP MANAGE POPUP - UPLOAD AVATAR/COVER OR UPDATE GROUP META ERROR: ', error);
          })
          .always(() => {
            // refresh
            window.location.reload();
          });
        } else {
          // refresh
          window.location.reload();
        }
      })
      .fail((error) => {
        // console.log('GROUP MANAGE POPUP - CREATE GROUP ERROR: ', error);

        this.setState({
          saving: false,
          error: true
        });
      });
    } else {
    // if editing a group
      // console.log('GROUP MANAGE POPUP - EDITING');

      // if required fields have no value, show message and return
      const emptyGroupName = this.state.groupData.name === '',
            emptyGroupDescription = this.state.groupData.description === '',
            usingForum = vikinger_constants.plugin_active.bbpress && vikinger_constants.settings['bbp_is_group_forums_active'] && this.state.groupData.enable_forum,
            emptyForumName = this.state.forum.post_title === '',
            emptyForumDescription = this.state.forum.post_content === '';

      if ((emptyGroupName || emptyGroupDescription) || (usingForum && (emptyForumName || emptyForumDescription))) {
        this.setState({
          markRequired: true,
          saving: false
        });

        // console.log('GROUP MANAGE POPUP - MISSING REQUIRED FIELDS');

        return;
      }

      let updateGroupDataPromise = {no_result: true},
          uploadAvatarPromise = {no_result: true},
          uploadCoverPromise = {no_result: true},
          deleteGroupMetaPromise = {no_result: true},
          updateGroupMetaPromise = {no_result: true};

      // get group data updated fields
      const updatedFields = this.getGroupDataUpdatedFields();

      // if there are updated fields, update them
      if (updatedFields) {
        // set group id to update
        updatedFields.id = this.props.data.id;

        updateGroupDataPromise = WP_Router.updateGroup(updatedFields);
      }

      // console.log('GROUP MANAGE POPUP - GROUP DATA UPDATED FIELDS: ', updatedFields);

      const avatarChanged = this.state.avatarFile,
            coverChanged = this.state.coverFile,
            groupMetaChanged = Object.keys(this.state.groupMetaToUpdate).length > 0,
            forumChanged = usingForum;

      // if there is nothing to update, return
      if (!updatedFields && !avatarChanged && !coverChanged && !groupMetaChanged && !forumChanged) {
        this.setState({
          saving: false
        });

        return;
      }

      // if avatar, cover or group meta changed, save them
      if (avatarChanged || coverChanged || groupMetaChanged) {
        const createdGroupID = this.props.data.id;

        // if user changed avatar, save it
        if (avatarChanged) {
          uploadAvatarPromise = WP_Router.uploadGroupAvatar({
            group_id: createdGroupID,
            file: this.state.avatarFile.file
          });
        }

        // if user changed cover, save it
        if (coverChanged) {
          uploadCoverPromise = WP_Router.uploadGroupCover({
            group_id: createdGroupID,
            file: this.state.coverFile.file
          });
        }

        // if user updated group meta, save it
        if (groupMetaChanged) {
          const groupMetaFieldsToDelete = [],
                groupMetaFieldsToUpdate = {};

          // console.log('GROUP MANAGE POPUP - GROUP META TO UPDATE STATE: ', this.state.groupMetaToUpdate);

          // only update meta fields if they are not empty, otherwise delete them
          for (const metaKey in this.state.groupMetaToUpdate) {
            const metaValue = this.state.groupMetaToUpdate[metaKey];

            if (metaValue === '') {
              groupMetaFieldsToDelete.push(metaKey);
            } else {
              groupMetaFieldsToUpdate[metaKey] = metaValue;
            }
          }

          // console.log('GROUP MANAGE POPUP - GROUP META TO DELETE: ', groupMetaFieldsToDelete);
          // console.log('GROUP MANAGE POPUP - GROUP META TO UPDATE: ', groupMetaFieldsToUpdate);

          if (groupMetaFieldsToDelete.length > 0) {
            // delete empty meta
            deleteGroupMetaPromise = WP_Router.deleteGroupMetaFields({
              group_id: createdGroupID,
              fields: groupMetaFieldsToDelete
            });
          }

          if (Object.keys(groupMetaFieldsToUpdate).length > 0) {
            // update non empty meta
            updateGroupMetaPromise = WP_Router.updateGroupMetaFields({
              group_id: createdGroupID,
              fields: groupMetaFieldsToUpdate
            });
          }
        }
      }

      let createGroupForumPromise = {no_result: true},
          deleteGroupForumPromise = {no_result: true};

      // associate forum to group
      if (forumChanged) {
        const forumData = app.deepMerge(this.state.forum);

        // console.log('GROUP MANAGE POPUP - UPDATE FORUM WITH DATA: ', forumData);

        createGroupForumPromise = WP_Router.createGroupForum(forumData, this.props.data.id);
      } else if (this.state.forum.ID) {
        // console.log('GROUP MANAGE POPUP - DELETE FORUM WITH DATA: ', this.state.forum);

        deleteGroupForumPromise = WP_Router.deleteGroupForum({forum_id: this.state.forum.ID, group_id: this.props.data.id});
      }

      jQuery
      .when(updateGroupDataPromise, uploadAvatarPromise, uploadCoverPromise, updateGroupMetaPromise, deleteGroupMetaPromise, createGroupForumPromise, deleteGroupForumPromise)
      .done((updateGroupDataPromiseResponse, avatarUploadResponse, coverUploadResponse, updateGroupMetaResponse, deleteGroupMetaResponse, createGroupForumResponse, deleteGroupForumResponse) => {
        // console.log('GROUP MANAGE POPUP - GROUP DATA UPDATE RESPONSE:', updateGroupDataPromiseResponse);
        // console.log('GROUP MANAGE POPUP - AVATAR UPLOAD RESPONSE:', avatarUploadResponse);
        // console.log('GROUP MANAGE POPUP - COVER UPLOAD RESPONSE:', coverUploadResponse);
        // console.log('GROUP MANAGE POPUP - GROUP META UPDATE RESPONSE:', updateGroupMetaResponse);
        // console.log('GROUP MANAGE POPUP - GROUP META DELETE RESPONSE:', deleteGroupMetaResponse);
        // console.log('GROUP MANAGE POPUP - CREATE GROUP FORUM RESPONSE:', createGroupForumResponse);
        // console.log('GROUP MANAGE POPUP - DELETE FORUM RESPONSE:', deleteGroupForumResponse);
      })
      .fail((error) => {
        // console.log('GROUP MANAGE POPUP - GROUP DATA UPDATE: ', error);
      })
      .always(() => {
        // refresh
        window.location = window.location;
      });
    }
  }

  componentDidMount() {
    this.popup = plugins.createPopup({
      triggerElement: this.props.groupManagePopupTriggerRef.current,
      premadeContentElement: this.groupManagePopupRef.current,
      type: 'premade',
      popupSelectors: ['group-manage-popup', 'animate-slide-down']
    });

    // only fetch group data if not creating
    if (!this.creating) {
      this.getGroupData();
    }
  }

  render() {
    const groupSocialMetaRows = [];

    let i = 0,
        groupSocialMetaFields = [];

    for (const field of this.state.groupMeta.social) {
      if (i === 2) {
        groupSocialMetaRows.push(groupSocialMetaFields);
        i = 0;
        groupSocialMetaFields = [];
      }

      groupSocialMetaFields.push(field);
      i++;
    }

    // dump remaining fields
    if (groupSocialMetaFields.length > 0) {
      groupSocialMetaRows.push(groupSocialMetaFields);
    }

    return (
      <div ref={this.groupManagePopupRef} className="popup-box-body" style={this.popupBoxStyles}>
      {
        !this.creating && !this.state.group &&
          <Loader />
      }
      {
        (this.creating || (!this.creating && this.state.group)) &&
          <React.Fragment>
            <div className="popup-box-sidebar">
              <UserGroupPreview data={this.state.group}
                                descriptionText={this.props.groupPreviewDescription}
              />

              <div className="sidebar-menu-item limited">
                <div className="sidebar-menu-body secondary">
                {
                  (this.creating || this.props.data.is_admin) &&
                    <React.Fragment>
                      <p  className={`sidebar-menu-link ${this.state.activeTab === 'group-info' ? 'active' : ''}`}
                          onClick={() => {this.setActiveTab('group-info');}}>
                        {vikinger_translation.group_info}
                      </p>

                      <p  className={`sidebar-menu-link ${this.state.activeTab === 'group-avatar-cover' ? 'active' : ''}`}
                          onClick={() => {this.setActiveTab('group-avatar-cover');}}>
                        {vikinger_translation.avatar_and_cover}
                      </p>

                      <p  className={`sidebar-menu-link ${this.state.activeTab === 'group-social' ? 'active' : ''}`}
                          onClick={() => {this.setActiveTab('group-social');}}>
                        {vikinger_translation.social_networks}
                      </p>

                      
                    </React.Fragment>
                }
                {
                  !this.creating &&
                    <React.Fragment>
                    {
                      (this.props.data.is_admin || this.props.data.is_mod) &&
                        <p  className={`sidebar-menu-link ${this.state.activeTab === 'group-members' ? 'active' : ''}`}
                            onClick={() => {this.setActiveTab('group-members');}}>
                          {vikinger_translation.members}
                        </p>
                    }
                    {
                      this.props.data.is_admin &&
                        <React.Fragment>
                          {
                            vikinger_constants.plugin_active.bbpress && vikinger_constants.settings['bbp_is_group_forums_active'] &&
                              <p  className={`sidebar-menu-link ${this.state.activeTab === 'group-forum' ? 'active' : ''}`}
                                  onClick={() => {this.setActiveTab('group-forum');}}>
                                {vikinger_translation.forum}
                              </p>
                          }

                          <p  className={`sidebar-menu-link ${this.state.activeTab === 'group-delete' ? 'active' : ''}`}
                            onClick={() => {this.setActiveTab('group-delete');}}>
                            {vikinger_translation.delete_group}
                          </p>
                        </React.Fragment>
                    }
                    </React.Fragment>
                }
                </div>
              </div>

              {
                (this.creating || (!this.creating && this.props.data.is_admin)) &&
                  <div className="popup-box-sidebar-footer">
                    <div className="button secondary full" onClick={this.save}>
                    {
                      !this.state.saving &&
                        <React.Fragment>
                          {this.creating ? vikinger_translation.create_group : vikinger_translation.save_changes}
                        </React.Fragment>
                    }
                    {
                      this.state.saving &&
                        <React.Fragment>
                          {this.creating ? vikinger_translation.creating : vikinger_translation.saving}
                          <LoaderSpinnerSmall />
                        </React.Fragment>
                    }
                    </div>
                  {
                    this.state.markRequired &&
                      <p className="required-field-message">* {vikinger_translation.required_fields_message}</p>
                  }
                  {
                    this.state.error &&
                      <p className="required-field-message">* {vikinger_translation.save_error_message}</p>
                  }
                    <p className="button white full" onClick={this.discardAll}>{vikinger_translation.discard_all}</p>
                  </div>
              }
            </div>

            <div className="popup-box-content limited">
            {
              this.state.activeTab === 'group-info' &&
                <div className="widget-box">
                  <p className="widget-box-title">{vikinger_translation.group_info}</p>

                  <div className="widget-box-content">
                    <div className="form">
                      <div className="form-row split">
                        <div className="form-item">
                          <FormInput  name="name"
                                      label={vikinger_translation.group_name}
                                      value={this.state.groupData.name}
                                      handleValue
                                      onChange={this.handleChange}
                                      required
                                      markAsRequired={this.state.markRequired && this.state.groupData.name === ''}
                                      modifiers="small"
                          />
                        </div>

                        <div className="form-item">
                          <FormSelect name="status"
                                      label={vikinger_translation.group_status}
                                      options={this.groupStatusOptions}
                                      value={this.state.groupData.status}
                                      handleValue
                                      onChange={this.handleChange}
                                      modifiers="small"
                          />
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-item">
                          <FormTextarea name="description"
                                        label={vikinger_translation.group_description}
                                        value={this.state.groupData.description}
                                        handleValue
                                        onChange={this.handleChange}
                                        required
                                        markAsRequired={this.state.markRequired && this.state.groupData.description === ''}
                                        modifiers="small mid-textarea"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
            }

            {
              this.state.activeTab === 'group-avatar-cover' &&
                <div className="widget-box">
                  <p className="widget-box-title">{vikinger_translation.avatar_and_cover}</p>

                  <div className="widget-box-content">
                    {/* GRID */}
                    <div className="grid grid-3-3-3 centered">
                      <UploadBox  title={this.state.uploadAvatarTitle}
                                  text="jpg/jpeg/png/gif"
                                  onFileSelect={this.updateAvatarFile}
                                  active={this.state.uploadAvatarActive}
                                  modifiers="upload-box-shadowed"
                      />

                      <UploadBox  title={this.state.uploadCoverTitle}
                                  text="jpg/jpeg/png/gif"
                                  onFileSelect={this.updateCoverFile}
                                  active={this.state.uploadCoverActive}
                                  modifiers="upload-box-shadowed"
                      />
                    </div>
                    {/* GRID */}
                  </div>
                </div>
            }

            {
              this.state.activeTab === 'group-social' &&
                <div className="widget-box">
                  <p className="widget-box-title">{vikinger_translation.social_networks}</p>

                  <div className="widget-box-content">
                    <div className="form">
                    {
                      groupSocialMetaRows.map((fields, i) => {
                        return (
                          <FormRow  key={i}
                                    data={fields}
                                    modifiers="split"
                                    handleValue
                                    onFieldUpdate={this.updateSocialMeta}
                          />
                        );
                      })
                    }
                    </div>
                  </div>
                </div>
            }

            {
              !this.creating &&
                <React.Fragment>
                  {
                    this.state.activeTab === 'group-members' &&
                      <div className="widget-box right-padded">
                        <p className="widget-box-title">{`${vikinger_translation.administrators} (${this.state.group.admins.length})`}</p>

                        <div className="widget-box-content">
                          <GroupMemberStatusList  data={this.state.group.admins}
                                                  group={this.state.group}
                                                  loggedUser={this.props.loggedUser}
                                                  onActionComplete={this.getGroupData}
                          />
                        </div>

                        <p className="widget-box-title">{`${vikinger_translation.mods} (${this.state.group.mods.length})`}</p>

                        {
                          (this.state.group.mods.length === 0) &&
                            <p className="no-results-text">{vikinger_translation.no_mods_found}</p>
                        }

                        {
                          (this.state.group.mods.length > 0) &&
                            <div className="widget-box-content">
                              <GroupMemberStatusList  data={this.state.group.mods}
                                                      group={this.state.group}
                                                      loggedUser={this.props.loggedUser}
                                                      onActionComplete={this.getGroupData}
                              />
                            </div>
                        }

                        <p className="widget-box-title">{`${vikinger_translation.members} (${this.state.group.members.length})`}</p>

                        {
                          (this.state.group.members.length === 0) &&
                            <p className="no-results-text">{vikinger_translation.no_members_found}</p>
                        }

                        {
                          (this.state.group.members.length > 0) &&
                            <div className="widget-box-content">
                              <GroupMemberStatusList  data={this.state.group.members}
                                                      group={this.state.group}
                                                      loggedUser={this.props.loggedUser}
                                                      onActionComplete={this.getGroupData}
                              />
                            </div>
                        }

                        <p className="widget-box-title">{`${vikinger_translation.banned_members} (${this.state.group.banned.length})`}</p>

                        {
                          (this.state.group.banned.length === 0) &&
                            <p className="no-results-text">{vikinger_translation.no_banned_members_found}</p>
                        }

                        {
                          (this.state.group.banned.length > 0) &&
                            <div className="widget-box-content">
                              <GroupMemberStatusList  data={this.state.group.banned}
                                                      group={this.state.group}
                                                      loggedUser={this.props.loggedUser}
                                                      onActionComplete={this.getGroupData}
                              />
                            </div>
                        }
                      </div>
                  }

                  {
                    this.state.activeTab === 'group-forum' &&
                      <div className="widget-box">
                        <p className="widget-box-title">{vikinger_translation.forum}</p>

                        <div className="widget-box-content">
                          <p className="widget-box-text"><span className="bold">{vikinger_translation.group_forum}</span></p>
                          <p className="widget-box-text">{vikinger_translation.group_forum_enable_title}</p>
                          <FormInputCheckbox  text={vikinger_translation.group_forum_enable_text}
                                              active={this.state.groupData.enable_forum}
                                              toggleActive={this.toggleForumActive}
                          />

                          {
                            this.state.groupData.enable_forum &&
                              <div className="widget-box-form">
                                <FormInput  name="post_title"
                                            label={vikinger_translation.forum_name}
                                            value={this.state.forum.post_title}
                                            handleValue
                                            onChange={this.handleForumChange}
                                            required
                                            markAsRequired={this.state.markRequired && this.state.forum.post_title === ''}
                                            modifiers="small"
                                />

                                <FormTextarea name="post_content"
                                              label={vikinger_translation.forum_description}
                                              value={this.state.forum.post_content}
                                              handleValue
                                              onChange={this.handleForumChange}
                                              required
                                              markAsRequired={this.state.markRequired && this.state.forum.post_content === ''}
                                              modifiers="small mid-textarea"
                                />

                                <FormSelect name="post_status"
                                            label={vikinger_translation.forum_privacy}
                                            options={this.forumPrivacyOptions}
                                            value={this.state.forum.post_status}
                                            handleValue
                                            onChange={this.handleForumChange}
                                            modifiers="small"
                                />
                              </div>
                          }
                        </div>
                      </div>
                  }

                  {
                    this.state.activeTab === 'group-delete' &&
                      <div className="widget-box">
                        <p className="widget-box-title">{vikinger_translation.delete_group}</p>

                        <div className="widget-box-content">
                          <p className="widget-box-text">{vikinger_translation.delete_group_text}</p>
                          <p className="widget-box-text"><span className="bold">{vikinger_translation.delete_group_confirmation}</span></p>
                          <div className="button tertiary" onClick={this.deleteGroup}>
                            {vikinger_translation.delete_group}
                            {
                              this.state.deleting &&
                                <LoaderSpinnerSmall />
                            }
                          </div>
                        </div>
                      </div>
                  }
                </React.Fragment>
            }
            </div>
          </React.Fragment>
      }
      </div>
    );
  }
}

module.exports = GroupManagePopup;