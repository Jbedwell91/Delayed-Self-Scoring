function Connection(startNode) {

    this.startNode = startNode
    this._start = {
        x: startNode.x,
        y: startNode.y
    }

    this.endNode = undefined
    this._end = {
        x: undefined,
        y: undefined
    }

    this.stroke = "5px black"
    this.highlightedStroke  = "8px #1DE9B6"
    this.errorStroke = "6px #FE2222"

    this._selected = false

    //init
    this.lineObject = canvas.display.line({
        start: this._start,
        end: {
            x: canvas.mouse.x,
            y: canvas.mouse.y
        },
        stroke: this.stroke,
        zIndex: "back",
        opacity: 0
    })

    canvas.addChild(this.lineObject)

    this.lineClickBuffer = canvas.display.line({
        start: this._start,
        end: {
            x: canvas.mouse.x,
            y: canvas.mouse.y
        },
        stroke: "18px black",
        zIndex: "back",
        opacity: 0
    })

    this._select = function(event) {
        conceptMap.deselect()


        conceptMap.selectedLine = this.parentConnection
        conceptMap.selectedLine.selected = true

        event.stopPropagation()
    }

    this.lineClickBuffer.bind("click", this._select)
    this.lineObject.bind("click", this._select)

    this.lineClickBuffer.parentConnection = this
    this.lineObject.parentConnection = this

    canvas.addChild(this.lineClickBuffer)
}

Connection.prototype = {
    constructor: Connection,

    set start(val) {
        this.lineObject.start = val
        this.lineClickBuffer.start = val

        this.lineObject.zIndex = "back"
        this.lineClickBuffer.zIndex = "back"


        if (this.lineObject.opacity == 0)
            this.lineObject.opacity = 1

        this._start = val
    },

    get start() {
        return this._start
    },

    set end(val) {
        this.lineObject.end = val
        this.lineClickBuffer.end = val

        this.lineObject.zIndex = "back"
        this.lineClickBuffer.zIndex = "back"

        if (this.lineObject.opacity == 0)
            this.lineObject.opacity = 1

        this._end = val
    },

    get end() {
        return this._end
    },

    set selected(val) {
        this._selected = val

        if (this._selected) {
            this.lineObject.stroke = this.highlightedStroke
        } else {
            this.lineObject.stroke = this.stroke
        }

        canvas.redraw()
    },

    get selected() {
        return this._selected
    },

    error: function() {
        this._selected = false
        this.lineObject.stroke = this.errorStroke
        canvas.redraw()
    },

    startText: function() {
        return this.startNode.text.toLowerCase()
    },

    endText: function() {
        return this.endNode.text.toLowerCase()
    },

    remove: function() {
        this.lineObject.remove()
        this.lineClickBuffer.remove()
    },

    setEndNode: function(endNode) {
        this.endNode = endNode
        this.end = {
            x: endNode.x,
            y: endNode.y
        }
    }
}

