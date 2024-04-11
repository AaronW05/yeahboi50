function hardright () {
    maqueen.motorRun(maqueen.Motors.M1, maqueen.Dir.CW, 120)
    maqueen.motorRun(maqueen.Motors.M2, maqueen.Dir.CCW, 120)
    basic.pause(200)
    maqueen.motorStop(maqueen.Motors.All)
}
function softleft () {
    maqueen.motorRun(maqueen.Motors.M2, maqueen.Dir.CW, 60)
    maqueen.motorRun(maqueen.Motors.M1, maqueen.Dir.CW, 20)
    left_turn = 1
}
function softright () {
    maqueen.motorRun(maqueen.Motors.M1, maqueen.Dir.CW, 60)
    maqueen.motorRun(maqueen.Motors.M2, maqueen.Dir.CW, 20)
    left_turn = 0
}
function Stopping () {
    while (IRL == 0 && IRR == 0) {
        maqueen.motorStop(maqueen.Motors.All)
    }
}
function hardleft () {
    maqueen.motorRun(maqueen.Motors.M2, maqueen.Dir.CW, 120)
    maqueen.motorRun(maqueen.Motors.M1, maqueen.Dir.CCW, 120)
    basic.pause(200)
    maqueen.motorStop(maqueen.Motors.All)
}
function Avoid () {
    avoiding = 1
    need_turn = 0
    hardright()
    all_ahead()
    basic.pause(500)
    while (avoiding == 1) {
        if (maqueen.readPatrol(maqueen.Patrol.PatrolLeft) == 0 || maqueen.readPatrol(maqueen.Patrol.PatrolRight) == 0) {
            hardright()
            avoiding = 0
        } else {
            if (need_turn) {
                hardright()
                need_turn = 0
            }
            all_ahead()
            counter = 0
            while (IRL + IRR == 2 && counter < 450) {
                counter += 1
                basic.pause(10)
            }
            hardleft()
            if (maqueen.Ultrasonic(PingUnit.Centimeters) < 10) {
                need_turn = 1
            } else {
                need_turn = 0
            }
        }
    }
}
function all_ahead () {
    maqueen.motorRun(maqueen.Motors.M1, maqueen.Dir.CW, 60)
    maqueen.motorRun(maqueen.Motors.M2, maqueen.Dir.CW, 60)
}
let counter = 0
let need_turn = 0
let avoiding = 0
let IRR = 0
let IRL = 0
let left_turn = 0
basic.showLeds(`
    . # # # .
    # . . . #
    # # # # #
    # . . . #
    # . . . #
    `)
loops.everyInterval(20, function () {
    IRL = maqueen.readPatrol(maqueen.Patrol.PatrolLeft)
    IRR = maqueen.readPatrol(maqueen.Patrol.PatrolRight)
})
basic.forever(function () {
    if (maqueen.Ultrasonic(PingUnit.Centimeters) < 10) {
        Avoid()
    } else {
        if (IRR == 0) {
            softright()
        } else if (IRL == 0) {
            softleft()
        } else if (IRR && IRL >= 5) {
            Stopping()
        } else {
            if (left_turn) {
                softright()
            } else {
                softleft()
            }
        }
    }
})
