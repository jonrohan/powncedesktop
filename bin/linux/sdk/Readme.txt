Adobe AIR 1.0 SDK
README FILE


======What's included in the SDK======

BIN

 - adl.exe - The AIR Debug Launcher (ADL) allows you to test an AIR application without first packaging and installing it. 
 - adt.bat - The AIR Developer Tool (ADT) packages your application as an AIR file for distribution.  

FRAMEWORKS

 - AIRAliases.js - Provides "alias" definitions that allow you to access the AIR runtime classes. 
 - AIRIntrospector.js - Assists in AIR application development, allowing you to inspect JavaScript properties, view the HTML DOM, and view source files at run time.  
 - AIRSourceViewer.js - Lets users view source files in an AIR application. 
 - servicemonitor.swf - Provides AIR applications with an event-based means of responding to changes in network connectivity to a specified host. 

LIB

 - adt.jar - The adt executable file, which is called by the adt.bat file. 
 - Descriptor.1.0.xsd - The application schema file. 

RUNTIME

 - The AIR runtime - The runtime is used by ADL to launch your AIR applications before they have been packaged or installed. 

SAMPLES

 - This folder contains a sample application descriptor file, a sample of the seamless install feature (badge.swf), and the default AIR application icons. 

SRC

 - This folder contains the source files for the seamless install sample. 

TEMPLATES

 - descriptor-template.xml - A template of the application descriptor file, which is required for each AIR application. 


======Getting Started with the AIR SDK======

1) Build your HTML files using the editor of your choice. Arrange them as you would on a web server, in a single folder with relative references.

2) If you are using the AIR APIs, include a <script> reference to the AIRAliases.js file. AIR APIs are only available to your application content (not to content loaded from remote sources). Also, there are limitations on calling the eval() function and similar APIs in AIR application content. For details, see the AIR SDK documentation (listed below).

3) Use ADT to test your application with the debugger.

4) Use ADL to build an application installer that can be distributed to other people.

5) If you're distributing your AIR application from a web page, refer to the topic "Distributing and installing using the seamless install feature" in "Developing Adobe AIR Applications with HTML and Ajax". 

More information about all of these steps is available in the "Developing Adobe AIR Applications with HTML and Ajax". See the next section for the locations of the AIR documentation.

If you want to build Flex-based AIR applications, download the Flex SDK: http://www.adobe.com/products/flex/sdk/ 


======AIR SDK Documentation======

The following Adobe AIR HTML developer documentation is available in the LiveDocs (online) format: 

 - Developing Adobe AIR Applications with HTML and Ajax -- http://www.adobe.com/go/learn_air_html
 - Adobe AIR Quick Starts for HTML -- http://www.adobe.com/go/learn_air_html_qs
 - Adobe AIR Language Reference for HTML Developers -- http://www.adobe.com/go/learn_air_html_jslr 


===Downloading Adobe AIR HTML documentation===

The Adobe AIR HTML documentation set (a ZIP file) is available for download here:

  http://www.adobe.com/go/learn_air_html_docs