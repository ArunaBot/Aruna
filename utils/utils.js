function need(level) {
    var xp = [100, 200, 400, 800, 1600, 3200, 6400, 12800, 25600, 51200, 102400, 204800, 409600, 
        819200, 1638400, 3276800, 6553600, 13107200, 26214400, 52428800, 104857600]
    return xp[level-1]
}

module.exports = {
    need:need
}