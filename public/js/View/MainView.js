define(function(require){
    'use strict';

    var _ = require('underscore'),
        $ = require('jquery'),
        datepicker = require('jquery-ui/ui/widgets/datepicker'),
        remodal = require('remodal'),
        Backbone = require('backbone'),
        template = require('./Templates/Main.hbs'),
        CalendarView = require('./CalendarView')
        // WinnerView = require('./WinnerView'),
        // Winner = require('../Model/Winner').default
    ;
    
    var MainView = Backbone.View.extend({

        defaults:{
            // winner:null
        },

        stateModel: new (Backbone.Model.extend({
            defaults: {
                modal: false
            }
        }))(),

        className: 'remodal-bg',

        template: template,

        initialize: function(){

            // this.winner = new Winner();

            // Main events here (popup)
            this.listenTo(this.stateModel, 'showModal', this.showModal);
            // Load podium & set global winner data
            // this.listenTo(this.winner, 'change', this.updateWinner);



            // Check if there is a winner
            // this.winner.fetch({reset: true});
            
            this.calendarView = new CalendarView({observer:this.stateModel});
            
            // Add to main context for notifications
            window.appObserver = this.stateModel;

        },
        
        render: function(){
            this.$el.html(template);

            // Load Calendar
            this.$el.find('#calendar').append(
                this.calendarView.render().$el
            );

            // Load Calendar
            let url = location.href.replace("calendar/", '');
            this.$el.find('#home-link').attr('href', url);

            return this;
        },

        // updateWinner: function(){
        //     // If we have a winner, load podium info
        //     if(this.winner.haveWinner()){
        //         // Load global object
        //         this.calendarView.winner = this.winner;
        //         this.showWinner();
        //     }else{
        //         console.log('No winner');
        //     }
        // },
        
        // showWinner: function(){
        //     this.$el.find('#calendar').before((new WinnerView({model:this.winner})).render().$el);
        // },
        
        showModal: function(options){
            var view = options.view;

            // Delayed init modal so it can add events to rendered tags
            if(!this.modal){
                this.modal = this.$el.find('[data-remodal-id=modal]').remodal({hashTracking:false});
            }

            if(!view || !this.modal){
                return;
            }

            // Call Modal
            this.modal.$modal.find('[data-remodal-content=main]').html(view.render().$el);
            this.modal.open();
        }
    });

    return MainView;
});
