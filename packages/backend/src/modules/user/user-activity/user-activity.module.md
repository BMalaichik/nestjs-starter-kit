# User-Activity Module

Provides API for tracking user-activities.

**IMPORTANT**:
Each activity message is resolved in runtime via Activity-Message Mapping Service.


Features:
 - **User-Activity Controller** - Activity API: retrieveing activity dashboard.
 - **User-Activity Service** - Core logic. Exposes activity track functionality
 - **Activity-Message Mapping Service** - Template resolution based on activity action.

 For setting up new activities, you need to:
 - Update ActivityAction enum
 - Update `enum_user_activity_activity_action` value
 - Add template to `activity-messages.properties`. **NOTE:** Key must ActivityAction enum value
