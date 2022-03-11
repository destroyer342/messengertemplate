Create new folder
Git init
git clone https://github.com/destroyer342/messengertemplate
Create a page
Go to https://developers.facebook.com/apps/
-	Create app
-	Go to Messenger then click setup
-	Connect your newly create page
-	Copy Generate token
 Paste your {Generated token} in  .ENV files
Enter any string to MY_VERIFY_FB_TOKEN  and  set a PORT
Go to github.com
Create a repository
Upload your code to this repository
Go to heroku.com , create app then click github connect. Connect to your github repository
Go to settings then enter the 4 config var
	NODE_ENV=development
PORT=8000
MY_VERIFY_FB_TOKEN=randomstringlang1
FB_PAGE_TOKEN=
Click deploy Branch
Go to developerFacebook again then click add callback URL
Callback URL= url of your website or heroku site(https://mestemplate.herokuapp.com/webhook)
Verify token= MY_VERIFY_FB_TOKEN
add subscriptions
Messages, messaging_postbacks, message_deliveries,standby, message_reactions, message_reads,message_echoes, messaging_handovers

Try your site then click setup ( to activate persistent menu )







