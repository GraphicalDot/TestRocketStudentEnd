(function(root, factory) {
    // Set up DT_bootstrap appropriately for the environment.
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['jquery'], function($) {
            factory($);
        });
    } else {
        // Browser globals
        factory(root.jQuery);
    }
}(this, function(jQuery) {
    // Toggle Left Menu
    jQuery('.nav-parent > a').click(function() {

        var parent = jQuery(this).parent();
        var sub = parent.find('> ul');

        // Dropdown works only when leftpanel is not collapsed
        if(!jQuery('body').hasClass('leftpanel-collapsed')) {
            if(sub.is(':visible')) {
                sub.slideUp(200, function(){
                    parent.removeClass('nav-active');
                    jQuery('.mainpanel').css({height: ''});
                    adjustmainpanelheight();
                });
            } else {
                closeVisibleSubMenu();
                parent.addClass('nav-active');
                sub.slideDown(200, function(){
                    adjustmainpanelheight();
                });
            }
        }
        return false;
    });

    function closeVisibleSubMenu() {
        jQuery('.nav-parent').each(function() {
            var t = jQuery(this);
            if(t.hasClass('nav-active')) {
                t.find('> ul').slideUp(200, function(){
                    t.removeClass('nav-active');
                });
            }
        });
    }

    function adjustmainpanelheight() {
        // Adjust mainpanel height
        var docHeight = jQuery(document).height();
        if(docHeight > jQuery('.mainpanel').height())
            jQuery('.mainpanel').height(docHeight);
    }


    // Tooltip
    /*jQuery('.tooltips').tooltip({ container: 'body'});

    // Popover
    jQuery('.popovers').popover();*/

    // Close Button in Panels
    jQuery('.panel .panel-close').click(function(){
        jQuery(this).closest('.panel').fadeOut(200);
        return false;
    });

    // Form Toggles
    /*jQuery('.toggle').toggles({on: true});

     jQuery('.toggle-chat1').toggles({on: false});*/


    // Minimize Button in Panels
    jQuery(document).on('click', '.minimize', function(){
        var t = jQuery(this);
        var p = t.closest('.panel');
        if(!jQuery(this).hasClass('maximize')) {
            p.find('.panel-body, .panel-footer').slideUp(200);
            t.addClass('maximize');
            t.html('&plus;');
        } else {
            p.find('.panel-body, .panel-footer').slideDown(200);
            t.removeClass('maximize');
            t.html('&minus;');
        }
        return false;
    });


    // Add class everytime a mouse pointer hover over it
    jQuery('.nav-bracket > li').hover(function(){
        jQuery(this).addClass('nav-hover');
    }, function(){
        jQuery(this).removeClass('nav-hover');
    });


    // Menu Toggle
    /*jQuery('.menutoggle').click(function(){

     var body = jQuery('body');
     var bodypos = body.css('position');

     if(bodypos != 'relative') {

     if(!body.hasClass('leftpanel-collapsed')) {
     body.addClass('leftpanel-collapsed');
     jQuery('.nav-bracket ul').attr('style','');

     jQuery(this).addClass('menu-collapsed');

     } else {
     body.removeClass('leftpanel-collapsed chat-view');
     jQuery('.nav-bracket li.active ul').css({display: 'block'});

     jQuery(this).removeClass('menu-collapsed');

     }
     } else {

     if(body.hasClass('leftpanel-show'))
     body.removeClass('leftpanel-show');
     else
     body.addClass('leftpanel-show');

     adjustmainpanelheight();
     }

     });*/
}));
/*
jQuery(document).ready(function() {
   
   // Toggle Left Menu
   jQuery('.nav-parent > a').click(function() {
      
      var parent = jQuery(this).parent();
      var sub = parent.find('> ul');
      
      // Dropdown works only when leftpanel is not collapsed
      if(!jQuery('body').hasClass('leftpanel-collapsed')) {
         if(sub.is(':visible')) {
            sub.slideUp(200, function(){
               parent.removeClass('nav-active');
               jQuery('.mainpanel').css({height: ''});
               adjustmainpanelheight();
            });
         } else {
            closeVisibleSubMenu();
            parent.addClass('nav-active');
            sub.slideDown(200, function(){
               adjustmainpanelheight();
            });
         }
      }
      return false;
   });
   
   function closeVisibleSubMenu() {
      jQuery('.nav-parent').each(function() {
         var t = jQuery(this);
         if(t.hasClass('nav-active')) {
            t.find('> ul').slideUp(200, function(){
               t.removeClass('nav-active');
            });
         }
      });
   }

   function adjustmainpanelheight() {
      // Adjust mainpanel height
      var docHeight = jQuery(document).height();
      if(docHeight > jQuery('.mainpanel').height())
         jQuery('.mainpanel').height(docHeight);
   }
   
   
   // Tooltip
   jQuery('.tooltips').tooltip({ container: 'body'});
   
   // Popover
   jQuery('.popovers').popover();
   
   // Close Button in Panels
   jQuery('.panel .panel-close').click(function(){
      jQuery(this).closest('.panel').fadeOut(200);
      return false;
   });
   
   // Form Toggles
   */
/*jQuery('.toggle').toggles({on: true});
   
   jQuery('.toggle-chat1').toggles({on: false});*//*

   
   
   // Minimize Button in Panels
   jQuery(document).on('click', '.minimize', function(){
      var t = jQuery(this);
      var p = t.closest('.panel');
      if(!jQuery(this).hasClass('maximize')) {
         p.find('.panel-body, .panel-footer').slideUp(200);
         t.addClass('maximize');
         t.html('&plus;');
      } else {
         p.find('.panel-body, .panel-footer').slideDown(200);
         t.removeClass('maximize');
         t.html('&minus;');
      }
      return false;
   });
   
   
   // Add class everytime a mouse pointer hover over it
   jQuery('.nav-bracket > li').hover(function(){
      jQuery(this).addClass('nav-hover');
   }, function(){
      jQuery(this).removeClass('nav-hover');
   });
   
   
   // Menu Toggle
   */
/*jQuery('.menutoggle').click(function(){
      
      var body = jQuery('body');
      var bodypos = body.css('position');
      
      if(bodypos != 'relative') {
         
         if(!body.hasClass('leftpanel-collapsed')) {
            body.addClass('leftpanel-collapsed');
            jQuery('.nav-bracket ul').attr('style','');
            
            jQuery(this).addClass('menu-collapsed');
            
         } else {
            body.removeClass('leftpanel-collapsed chat-view');
            jQuery('.nav-bracket li.active ul').css({display: 'block'});
            
            jQuery(this).removeClass('menu-collapsed');
            
         }
      } else {
         
         if(body.hasClass('leftpanel-show'))
            body.removeClass('leftpanel-show');
         else
            body.addClass('leftpanel-show');
         
         adjustmainpanelheight();         
      }

   });*//*

});*/
