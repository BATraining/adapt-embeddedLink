/*
 * adapt-embeddedLink
 * Copyright (C) 2015 Bombardier Inc. (www.batraining.com)
 * https://github.com/BATraining/adapt-embeddedLink/blob/master/LICENSE
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
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

        preRender: function() {
            this.initialSetUp();

        },

        initialSetUp:function(){
            var videoExtensionsList = ["mp4","ogv","ogg"];
            var imageExtensionsList = ["jpg","png","jpeg","svg","gif","bmp"];
            var extension = this.model.get("_source").split(".")[1];

            _.each(videoExtensionsList, function(videoExtension,index){
                if(extension == videoExtension){
                    this.model.set("_isVideo",true);
                }
            },this);
            _.each(imageExtensionsList, function(imageExtension,index){
                if(extension == imageExtension){
                    this.model.set("_isImage",true);
                }
            },this);
        },

        postRender: function() {
            //alert(Adapt.device.browser);
            this.listenTo(Adapt,'device:changed',this.resizeDevice,this);
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
            this.resizeDevice();
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

        resizeDevice:function(){
            var posterSrc = this.model.get("_posterImage");
            var source = this.model.get("_source");
            if(Adapt.device.screenSize != 'large'){

                if(this.model.get("_isImage")){
                    this.$(".embeddedLink-image").attr('src',posterSrc);
                    this.$(".embeddedLink-image").css('cursor','default') ;
                }
                else
                {
                    if(!this.model.get('_isVideo')){
                        this.$('.embeddedLink-iframe').hide();
                        this.$('.embeddedLink-iframe-posterImage').show();
                    }
                    this.$('.embeddedLink-zoomin-button').hide();
                }
            }
            else{
                if(this.model.get("_isImage")){
                    this.$(".embeddedLink-image").attr('src',source);
                    this.$(".embeddedLink-image").css('cursor','pointer') ;
                }
                else
                {
                    if(!this.model.get('_isVideo')){
                        this.$('.embeddedLink-iframe-posterImage').hide();
                        this.$('.embeddedLink-iframe').show();
                    }
                    this.$('.embeddedLink-zoomin-button').show();
                }
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
            if(Adapt.device.screenSize != 'large')return

            var imageSource = this.model.get("_imageSource");
            window.open(imageSource,'_blank','width=1024,height=768,left=100,top=100');
        }

    });

    Adapt.register("embeddedLink", EmbeddedLink);

    return EmbeddedLink;

});