define = define || RequireJS.define;

(function (require, define) {
  'use strict';

  require.config({
    baseUrl: "../",
    paths: {
      /* Load jquery from google cdn */
      'jquery': ['//ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min'],
      /* Load from cdn */
      'backbone': ['https://cdnjs.cloudflare.com/ajax/libs/backbone.js/1.3.3/backbone-min'],
      'underscore': ['https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min'],
      'text': ['https://cdnjs.cloudflare.com/ajax/libs/require-text/2.0.12/text.min']
    },
    shim: {
      /* Set bootstrap dependencies (just jQuery) */
      'backbone' : ['underscore']
    }
  });

  require([
    'jquery',
    'underscore',
    'backbone',
    'text!/static/site-assets/sodexo/html/podium.html',
    'text!/static/site-assets/sodexo/html/podium-list.html',
    'text!/static/site-assets/sodexo/html/podium-footer.html',
    ], function ($, _, Backbone, podiumTpl, tableTpl, footerTpl) {

    var I18nCatalog = {
      "RANKING": {
        "es-419": "RANKING",
        "pt-br": "RANKING"
      },
      "del Tour de Calidad de Vida": {
        "es-419": "del Tour de Calidad de Vida",
        "pt-br": "do Tour de Qualidade de Vida"
      },
      "General": {
        "es-419": "General",
        "pt-br": "Geral"
      },
      "Nombre de Usuario": {
        "es-419": "Nombre de Usuario",
        "pt-br": "Nome de usuário"
      },
      "Puntos": {
        "es-419": "Puntos",
        "pt-br": "Pontos"
      },
      "Así vas en": {
        "es-419": "Así vas en",
        "pt-br": "Assim você vai em"
      }
    };

    var lang = $('html').attr('lang');
    var i18n = function (msgid) {
      var entry = I18nCatalog[msgid];

      // The default language
      if (typeof lang === 'undefined') {
        lang = 'en-US';
      }

      // If the value is not in the catalog, then return the same ID
      if (typeof entry === 'undefined') {
        console.log("msgid not in catalog:", msgid);
        return msgid;
      }

      var msgstr = entry[lang];

      // If the value is not in the catalog, then return the same ID
      if (typeof msgstr === 'undefined' || msgstr === "") {
        console.log("msgstr is empty:", msgid);
        return msgid;
      }
      return msgstr;
    };

    var ApplicationRouter = Backbone.Router.extend({
      routes: {
        "": "home",
        "general": "home",
        "recognition": "recognition",
        "personal_growth": "personal_growth",
        "physical_environment": "physical_environment",
        "health_and_wellbeing": "health_and_wellbeing",
        "social_interaction": "social_interaction",
        "ease_and_efficiency": "ease_and_efficiency"
      },
      initialize: function() {
        this.podiumView = new PodiumView();
      },
      recognition: function() {
        this.podiumView.render({cat: 'recognition'});
        this.listView = new ListView('Recognition');
      },
      personal_growth: function() {
        this.podiumView.render({cat: 'personal_growth'});
        this.listView = new ListView('Personal Growth');
      },
      physical_environment: function() {
        this.podiumView.render({cat: 'physical_environment'});
        this.listView = new ListView('Physical environment');
      },
      health_and_wellbeing: function() {
        this.podiumView.render({cat: 'health_and_wellbeing'});
        this.listView = new ListView('Health & Well-Being');
      },
      social_interaction: function() {
        this.podiumView.render({cat: 'social_interaction'});
        this.listView = new ListView('Social Interaction');
      },
      ease_and_efficiency: function() {
        this.podiumView.render({cat: 'ease_and_efficiency'});
        this.listView = new ListView('Ease & Efficiency');
      },
      home: function() {
        this.podiumView.render({cat: 'general'});
        this.listView = new ListView('general');
      }
    });

    var PodiumView = Backbone.View.extend({
      el: "#podium-js",
      template: podiumTpl,

      initialize: function() {
      },
      render: function(options) {
        options = _.extend({}, options);
        options.i18n = i18n;
        // Get the options from the html
        var backgroundImg = $('#podium-js').data('background-img');
        if (typeof backgroundImg !== 'undefined') {
          options.backgroundImg = backgroundImg;
        }
        var template =_.template(this.template);
        $(this.el).html(template(options));
      }
    });

    var FooterView = Backbone.View.extend({
      el: "#podium-footer-js",
      template: footerTpl,
      render: function(person, category) {
        var template = _.template(this.template);
        this.$el.html(template({model: person, category: category, i18n:i18n}));
      }
    });

    var ListView = Backbone.View.extend({
      el: "#podium-table-js",
      template: tableTpl,
      initialize: function(category) {
        this.people = new People();
        this.profiles = new Profiles();
        this.category = category;
        // Get the options from the html
        this.podiumLength = $('#podium-js').data('podium-max-length') || 10;
        this.blackList = $('#podium-js').data('username-black-list') || "";
        this.blackList = this.blackList.split(",");

        this.people.bind("reset", _.bind(this.getImages, this));
        this.profiles.bind("reset", _.bind(this.render, this));

        this.people.fetch({category: this.category, reset: true});
      },
      getImages: function() {
        var self = this;

        var usernames = _.uniq(this.people.pluck('username'));
        this.profiles.fetch({data: {username: usernames.join(",")}, reset: true});
      },
      render: function() {
        var self = this;
        // Remove the loader
        $('#podium-js .podium-container.loading').removeClass('loading');

        this.people.addImages(this.profiles);
        this.me = this.people.pop({silent: true});

        var blackListed = this.people.filter(function(person){
          // Any usermane the blackList passes the filter
          return self.blackList.indexOf(person.get("username")) !== -1;
        })
        this.people.remove(blackListed);
        // Remove the position for the current user is when it is blacklisted
        if (this.blackList.indexOf(this.me.get("username")) !== -1) {
          this.me.set("my_position", "");
        }

        var renderFooter = true;
        this.people.all(function(person, index) { // iterate through the collection
          // Break the loop if we reach the max length
          if (index >= self.podiumLength) {
            return false;
          }

          var template = _.template(self.template);
          self.$el.append(template({model: person, me: self.me, category: self.category, i18n:i18n}));

          if (person.getSelfClass(self.me) === 'self') {
            renderFooter = false;
          }
          return true;
        });

        if (renderFooter) {
          this.footerView = new FooterView();
          this.footerView.render(self.me, self.category);
        }
      }
    });

    var Person = Backbone.Model.extend({
      defaults: {
        student : "",
        username : "",
        imageSrc : ""
      },
      addImage: function(imageSrc){
        return this.set({imageSrc: imageSrc});
      },
      getMedalClass: function(){
        var map = {
          1: 'gold',
          2: 'silver',
          3: 'bronze'
        };
        return map[this.getDisplayPosition()] || '';
      },
      getDisplayName: function(){
        return this.get('student').toUpperCase();
      },
      getDisplayPoints: function(category){
        var points;
        if (category === 'general') {
          points = this.get('percent');
        }
        else {
          var gradeBreakdown = this.get('grade_breakdown');
          var gradeInThisCat = _.find(gradeBreakdown, function(grade){
            var rule = /[-\s&%*#!]/g;  // No spaces or weird chars

            var a = category.replace(rule, '').toLowerCase();
            var b = grade.category.replace(rule, '').toLowerCase();
            return a == b;
          });

          points = gradeInThisCat.percent;
        }

        var display = String(parseFloat(Math.round(points * 100)));
        return display + ' pts';
      },
      getDisplayImage: function(){
        return this.get('imageSrc').image_url_large;
      },
      getSelfClass: function(other){
        if (other.get('username') === this.get('username')) {
          return 'self';
        }
        return '';
      },
      getDisplayPosition: function(){
        if (typeof this.collection !== 'undefined') {
          var index = this.collection.indexOf(this);
          return index + 1;
        }

        if (typeof this.get('my_position') !== 'undefined') {
          return this.get('my_position');
        }

        return '';
      }
    });

    var People = Backbone.Collection.extend({
      getBlockId: function() {
        var location = $('#podium-js').data('location');
        if (typeof location === 'undefined') {
          console.error("Configuration error. The #podium-js element requires a data-location parameter");
          return;
        }
        return location;
      },
      getCourseId: function() {
        var courseId = $('#podium-js').data('course-id');
        if (typeof courseId === 'undefined') {
          console.error("Configuration error. The #podium-js element requires a data-course-id parameter");
          return;
        }
        return courseId;
      },
      addImages: function(profiles) {
        this.each(function(person) {
          var thisProfile = profiles.findWhere({username: person.get('username')});
          if (typeof thisProfile !== 'undefined') {
            person.addImage(thisProfile.get('profile_image'));
          }
        });
      },
      url: function() {
        var url = [
          "",  // This is the host, in case we ever specify one.
          "courses",  // This is fixed for the LMS
          this.getCourseId(),
          "xblock",   // This is fixed for the LMS
          this.getBlockId(),
          "handler",  // This is fixed for the LMS
          "get_podium",  // Fixed for the grade-podium-xblock
        ].join("/");
        return url;
      },
      model: Person,
      fetch: function(options) {
          options = _.extend({category: "general"}, options);

          // Extend the options to make it work with the json_handler
          options.type = "POST";
          if (options.category === "general") {
            options.data = "{}";
          }
          else {
            options.data = JSON.stringify({category: options.category});
          }

          //Call Backbone's fetch
          return Backbone.Collection.prototype.fetch.call(this, options);
      }
    });

    var PublicProfile = Backbone.Model.extend({
      defaults: {
        profile_image : {
          image_url_small: "",
          image_url_medium: "",
          image_url_large: "",
          image_url_full: "",
        }
      },
    });

    var Profiles = Backbone.Collection.extend({
      model: PublicProfile,
      url: function() {
        return '/api/user/v1/accounts';
      }
    });

    var app = new ApplicationRouter();
    Backbone.history.start();

  });

}).call(this, require || RequireJS.require, define || RequireJS.define);
