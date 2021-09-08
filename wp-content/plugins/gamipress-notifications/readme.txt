=== GamiPress - Notifications ===
Contributors: gamipress, tsunoa, rubengc, eneribs
Tags: gamipress, gamification, point, achievement, rank, badge, award, reward, credit, engagement, ajax
Requires at least: 4.4
Tested up to: 5.6
Stable tag: 1.3.8
License: GNU AGPLv3
License URI: http://www.gnu.org/licenses/agpl-3.0.html

Instantly notify of achievements, steps and/or points awards completion to your users.

== Description ==

Notifications gives you the ability to live notify to your users about new achievements, steps, points awards, points deductions, ranks and/or rank requirements completion.

While your users are interacting with your site, they will get notified without refresh the page when an action gives them something related to GamiPress.

Also, you can configure text patterns to show as example the user name to make notifications more personalized.

= Features =

* Ability to live notify to your users about new achievements, steps, points awards, points deductions, ranks and/or rank requirements completion.
* Ability to selectively disable which notify to your users.
* Ability to positioning the notification in 8 different positions.
* Ability to set the lifetime of new notifications.
* Ability to enable the click to hide on notifications.
* Customizable notification sound effects.
* Easy controls to customize the background and text colors of notifications.
* Ability to enable the notification auto hide and the delay to perform it.
* Ability to disable live notifications checks making notifications work just on page load.
* Ability to configure each notification title pattern.
* Ability to configure the achievements look (thumbnail, earners, steps, etc).
* Ability to configure the ranks look (thumbnail, earners, requirements, etc).
* Integrated with the official add-ons that add new content to achievements and ranks.

== Installation ==

= From WordPress backend =

1. Navigate to Plugins -> Add new.
2. Click the button "Upload Plugin" next to "Add plugins" title.
3. Upload the downloaded zip file and activate it.

= Direct upload =

1. Upload the downloaded zip file into your `wp-content/plugins/` folder.
2. Unzip the uploaded zip file.
3. Navigate to Plugins menu on your WordPress admin area.
4. Activate this plugin.

== Frequently Asked Questions ==

== Changelog ==

= 1.3.8 =

* **Bug Fixes**
* Fixed "Attempts to cancel" setting display.

= 1.3.7 =

* **Improvements**
* Updated deprecated jQuery functions.

= 1.3.6 =

* **Improvements**
* Catch errors triggered from new Chrome Privacy policies.
* **Notes**
* Since Chrome 87, won't be possible anymore to autoplay audio without user direct interaction with the website, it means that until user "plays" with the website (click or tap anywhere), audios can't get autoplayed.

= 1.3.5 =

* **Improvements**
* Apply points format on templates.

= 1.3.4 =

* **Improvements**
* Improved the way notifications are getting marked as read.

= 1.3.3 =

* **New Features**
* Added the setting "Attempts to cancel live checks" to disable live checks when a user stays a long time without receive any notification.
* **Improvements**
* Performance improvements reducing the live check calls to the half.
* Added check to ensure the user has seen the notifications when live checks are disabled.
* **Bug Fixes**
* Fixed notification patterns autoload on first install.

= 1.3.2 =

* **Improvements**
* Make notifications script run only on the active browser tab.
* Improve notifications ids to better determine when a notification has been duplicated or not.

= 1.3.1 =

* **Improvements**
* Added extra checks to prevent duplicated notifications if plugin scripts gets loaded multiples times by others plugins.

= 1.3.0 =

* **Bug Fixes**
* Prevent blank notifications if notification text patterns hasn't been setup yet.

= 1.2.9 =

* **Improvements**
* Improved notifications display on mobile devices.

= 1.2.8 =

* **Bug Fixes**
* Fixed undefined notices on Javascript.
* **Improvements**
* Prevent large amount of notifications caused if there is a great amount of user earnings before the last check.
* **Developer Notes**
* Added a hook to customize the new notifications limit, by default 10.

= 1.2.7 =

* **Bug Fixes**
* Correctly setup the notification id attribute.

= 1.2.6 =

* **New Features**
* Added support to GamiPress 1.8.0.
* **Improvements**
* Make use of WordPress security functions for ajax requests.

= 1.2.5 =

* **New Features**
* New setting to customize the notification width on big screens.
* Support to responsive notifications on small screens.

= 1.2.4 =

* **Improvements**
* Added extra checks to determine if notification sound files are correctly set.
* **Bug Fixes**
* Fixed errors caused by empty or wrong sound files sources.

= 1.2.3 =

* **Improvements**
* Improved sound effect compatibility with newer browsers.
* Avoid Notify.js conflicts by renaming plugin notify() function to gamipress_notify().

= 1.2.2 =

* **New Features**
* Added support to GamiPress 1.7.0.

= 1.2.1 =

* **Bug Fixes**
* Fixed mark already displayed notifications with a small live check delay setup.
* **Developer Notes**
* Added new hooks to make add-on more extensible.

= 1.2.0 =

**Improvements**
* Prevent empty notifications.
* Improved sound effect compatibility with older browsers.
* Reset public changelog (moved old changelog to changelog.txt file).
* **Developer Notes**
* Added new hooks to make add-on more extensible.
