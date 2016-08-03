---
layout: post
title: "Running UpRev Tuner on a Mac via VirtualBox"
author: Chase Courington
tags: cars nissan uprev virtualbox
category: software
featured_image: /images/posts/getting-started.jpg
---

#### #TLDR
[[VirtualBox](http://download.virtualbox.org/virtualbox/5.1.2/VirtualBox-5.1.2-108956-OSX.dmg), [Modern.IE](https://az792536.vo.msecnd.net/vms/VMBuild_20160802/VirtualBox/MSEdge/MSEdge.Win10_RS1.VirtualBox.zip),
[Uprev](http://uprev.com/secure/support)]

Unzip the Windows OS and install it on the VM. In the VM settings setup a shared USB port on the host. Ensure you've disconnected that USB port from your host, so the vm can attach to it. Increase RAM and CPU available to the VM, close/kill applications/processes on the host.

Boot up Windows on the VM (go fullscreen! tune the graphics performance) and open up MS Edge, go to [Uprev](http://uprev.com/secure/support) and download the `Osiris Installer.exe`. Install Osiris on the Windows VM. Open up Osiris Flasher to Flash your ECU.

Osiris Flasher will read "No Connection". Connect the USB to the host and then connect the OBD2 on the vehicle. You should see the message change and the UI unlock with some options. You'll need a shared directory between your host and your vm, so you'll need to specify that in the preferences. You can put your ROM in the shared folder or just download it from email to the vm and specify that .rom file for flashing. Flash the ECU! Keep and eye on battery and power consumption. If you tuned right and shut down processes on the host you should be ok, I only ran 10% off in about 15 min.

----
## The Problem

----
## The setup

----
## Run It

----
## Tear down/exporting

----
## Conclusion
