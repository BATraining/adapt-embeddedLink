# adapt-embeddedLink

A graphical Component

##Installation

First, be sure to install the [Adapt Command Line Interface](https://github.com/adaptlearning/adapt-cli), then from the command line run:-

        adapt install adapt-embeddedLink

This component can also be installed by adding the component to the adapt.json file before running `adapt install`:

        "adapt-embeddedLink": "*"

##Usage

To Be Updated

##Settings overview

An complete example of this components settings can be found in the [example.json](https://github.com/BATraining/adapt-embeddedLink/blob/master/example.json) file. A description of the core settings can be found at: [Core model attributes](https://github.com/adaptlearning/adapt_framework/wiki/Core-model-attributes)

Further settings for this component are:

####_component

This value must be: `embeddedLink`

####_classes

You can use this setting to add custom classes to your template and LESS file.

####_layout

This defines the position of the component in the block. Values can be `full`, `left` or `right`.

####_page

This is text block which contains contains `title`, `body`, `audioSrc`, `audioTypes`

####title

This is title of description

####body

This is body of description

####audioSrc

It is source of the audio which play when description is inview or audio button is clicked

####audioTypes

It is type of audio to load and contains `type` and `codec`

####type

Type of audio

####codec

Codec of audio

####_source

This is source of media which will be displayed in iFrame

####_imageSource

This can have url for any other link which will appears on click of image

####_isLightBox

This can be `true` if user want to open media in lightBox else `false`





