$(function() {
    $('#timer-countdown').countdown({
        from: 180, // 3 minutes (3*60)
        to: 0, // stop at zero
        movingUnit: 1000, // 1000 for 1 second increment/decrements
        timerEnd: undefined,
        outputPattern: '$day Day $hour : $minute : $second',
        autostart: true
    });
    $('#timer-countup').countdown({
        from: 0,
        to: 180
    });
    $('#timer-countinbetween').countdown({
        from: 60,
        to: 20
    });
    $('#timer-countercallback').countdown({
        from: 1440,
        to: 0,
        timerEnd: function() {
            this.animate({ 'opacity': .5 }, 500).css({ 'text-decoration': 'line-through' });
        }
    });
    $('#timer-outputpattern').countdown({
        outputPattern: '$day Days $hour Hours $minute Minutes $second Seconds',
        from: 60 * 60 * 24 * 3
    });
});