/*
 * adapt-embeddedLink
 * License - https://github.com/adaptlearning/adapt_framework/blob/master/LICENSE
 * Maintainer - Amruta Thakur <amruta.thakur@exultcorp.com>
*/

define(function(require) {

    var ComponentView = require("coreViews/componentView");
    var Adapt = require("coreJS/adapt");
    var mep = require('components/adapt-embeddedLink/js/mediaelement-and-player.min');
    var lightBox = require('components/adapt-embeddedLink/js/jquery.jsmodal');

    var EmbeddedLink = ComponentView.extend({

        events: {
            'click .embeddedLink-zoomin-button':'onClickZoomInButton',
            'click .embeddedLink-graphic-pin': 'onClickAudioButton',
            'click .embeddedLink-image':'onClickImage'
        },

        preRender: function() {},

        postRender: function() {
            //alert(Adapt.device.browser);

            this.$('.embeddedLink-description').on('inview', _.bind(this.inview, this));
            var $self = this;
            this.$('.embeddedLink-iframe').ready(function() {
                $self.setReadyStatus();
            });

            if($('html').hasClass('ie8')) {
                var audioObject=new MediaElementPlayer(this.$('audio')[0]);
                this.model.set('_audioObjectForIE',audioObject);
            }
            this.$('.mejs-container').addClass('display-none');
            this.$('audio').on('ended', _.bind(this.onAudioEnded, this));
        },

        inview: function(event, visible) {
            var addedMute = this.$('.embeddedLink-graphic-pin-icon').hasClass('icon-sound-mute');
            this.stopCurrentAudio();
            this.stopAudio();
            if (visible && !addedMute) {
                var audioElement;
                if($('html').hasClass('ie8')) {
                    audioElement=this.model.get('_audioObjectForIE');
                }
                else{
                    audioElement = this.$("audio")[0];

                }
                this.playAudioForElement(audioElement);
                this.setCompletionStatus();
            }
            else{
                this.stopCurrentAudio();
                this.stopAudio();
            }
        },

        stopAudio: function () {
            var audioObject = this.model.get('_audioObjectForIE');

            if(audioObject) {
                audioObject.setCurrentTime(0);
                audioObject.pause();
                this.model.set("_audioObjectForIE", '');
                this.$('.embeddedLink-graphic-pin-icon').addClass('icon-sound-mute');
            }
        },

        stopCurrentAudio:function(){
            var audioElement = this.model.get("_currentAudioElement");

            if (audioElement) {
                if (!audioElement.paused && audioElement.pause) {
                    audioElement.pause();
                }
                if (audioElement.currentTime != 0) {
                    audioElement.currentTime = 0.0;
                }
                this.model.set("_currentAudioElement", '');
                this.$('.embeddedLink-graphic-pin-icon').addClass('icon-sound-mute');
            }
        },

        playAudioForElement:function(audioElement){

            if (audioElement) {
                if(!$('html').hasClass('ie8')){
                    this.stopCurrentAudio();
                    this.model.set("_currentAudioElement", audioElement);
                }
                if(audioElement.play) audioElement.play();
            }
        },

        onAudioEnded: function(event) {

            if($('html').hasClass('ie8')) {
                this.stopAudio();
            } else {
                this.model.get("_currentAudioElement").currentTime = 0.0;
                this.model.set("_currentAudioElement", '');
            }
            this.$('.embeddedLink-graphic-pin-icon').addClass('icon-sound-mute');
        },

        onClickAudioButton:function(event){
            if(event && event.preventDefault) event.preventDefault();

            var audioElement;
            var isIE8 = $('html').hasClass('ie8');

            if(isIE8){
                audioElement = this.model.get("_audioObjectForIE");
            }
            else{
                audioElement = this.model.get("_currentAudioElement");
            }
            if(audioElement==''){
                if(isIE8){
                    audioElement=new MediaElementPlayer(this.$('.embeddedLink-item-audio audio')[0]);
                }
                else{
                    audioElement = this.$('.embeddedLink-item-audio audio')[0];
                }
                this.playAudioForElement(audioElement);
                this.$('.embeddedLink-graphic-pin-icon').removeClass('icon-sound-mute');
            }
            else {
                if(isIE8) {
                    this.stopAudio();
                } else {
                    this.stopCurrentAudio();
                }
                this.$('.embeddedLink-graphic-pin-icon').addClass('icon-sound-mute');
            }
        },

        onClickZoomInButton:function(event){
            event.preventDefault();
            var browser = Adapt.device.browser;
            if(browser == 'ipad'){
                this.$(".embeddedLink-lightBox-iframe-parent").css({'overflow':'auto' , '-webkit-overflow-scrolling':'touch'});
            }
            var isLightBox=this.model.get("_isLightBox");
            var source = this.model.get("_source");

            //Pause all the videos on popout button clicked
            var videoPause=$("video");
            for(var i=0;i<videoPause.length;i++){
                videoPause[i].pause();
            }

            if(isLightBox){
                this.$('.embeddedLink-lightBox-popup-container').modal();
            }
            else{
                window.open(source,'_blank','width=1024,height=768,left=100,top=100');
            }
        },
        onClickImage:function(event){
            event.preventDefault();

            var imageSource = this.model.get("_imageSource");
            window.open(imageSource,'_blank','width=1024,height=768,left=100,top=100');
        }

    });

    Adapt.register("embeddedLink", EmbeddedLink);

    return EmbeddedLink;

});