function SigmoidFactory(k) {
    function clamp(val, lower, upper) {
        return Math.max(Math.min(val, upper), lower);
    }

    function base(t) {
        return (1 / (1 + Math.exp(-k * t))) - 0.5;
    }

    var correction = 0.5 / base(1);

    return function(t) {
        t = clamp(t, 0, 1);
        return correction * base(2 * t - 1) + 0.5;
    };
}