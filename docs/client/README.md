# Client Documentation
Any information associated with the client aspect of the application will be located in this given file. Be sure to utlize any and all links given below to help bring you up to speed on what we learned and used during our year of developing the project.

## Helpful Links:
https://www.youtube.com/watch?v=Fdf5aTYRW0E <~ Anguar Crash Course Video

https://ionic.io/resources/articles/ionic-react-vs-react-native 

https://ionicframework.com/docs/api/datetime 

https://ionicframework.com/docs/native/date-picker 

https://medium.com/angular-in-depth/read-your-production-angular-errors-like-a-pro-32c3df34bdae 

https://www.youtube.com/channel/UCSJbGtTlrDami-tDGPUV9-w 

## Building for Android

Use the following steps to get your build environment set up. The following are good references for when you encounter issues: 

- https://ionicframework.com/docs/cli/commands/cordova-compile 

- https://cordova.apache.org/docs/en/latest/guide/platforms/android/index.html 

- https://ionicframework.com/docs/v1/guide/publishing.html 

 

Put the compile-to device in developer mode. The way to do this will vary based on the phone or tablet but should be easy to find with a Google search. 

Set the developer mode option of “USB debugging” to ON. 

Open your console or Gitbash in the project directory and install cordova (if not already installed) with the following command: 

sudo npm install -g cordova 

Download Android Studio from the following link:  

- https://raw.github.com/Homebrew/homebrew/go/install 

Unpack the file in the desired directory and set the path to the directory in environment settings.  

Downnload Gradle from the following link: 

- https://gradle.org/ 

Unpack the file in the desired directory and set the path to the directory in environment settings.  

Plug the desired device into a USB port on your computer 

Give your laptop permissions from your phone 

Run the command: 

ionic cordova build android --device --verbose 

The compiling process will take a good 5 minutes if successful. 

In your first run you are likely to have a few libraries missing. Googling the error should identify what is missing. 

You could use ANT or even the Android workbench as different pathways to compile but the those will have to require your own research. 

## Plans, Cycles, and Sections
2019 team: This topic alone brought on the most confusion and misunderstandings out of our whole capstone experience. Hopefully this description can help keep you guys from the pain that we had to go through.
 - Plan: Overarching name of a devotion that someone can begin. Has very little metadata about itself besides a name and a related group.
 - Content Cycle: This is the confusing one. Content Cycles are basically just metadata. There are many Content Cycles inside of a plan. Each Content Cycle is “meant” to have the same topics within it so that the user can go through the same information multiple times but is not restricted to this. This is easier explained through an example, but if you want an easier way to think of it, think of a Content Cycle as a milestone in the Plan. 
 - Section: These are the actual devotions. These are what the user is clicking through and is able to read and add prayers and journals to. There are many Sections inside of a single Content Cycle. 
