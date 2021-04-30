# Client Documentation
Any information associated with the client aspect of the application will be located in this given file. Be sure to utlize any and all links given below to help bring you up to speed on what we learned and used during our year of developing the project.

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
