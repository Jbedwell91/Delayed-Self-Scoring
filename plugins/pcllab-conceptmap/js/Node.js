function Node(x, y, text) {

    this.x = x
    this.y = y
    this._text = text

    this.fill = "#5DC6BC"
    this.stroke = "3px #23b6b8"
    this.highlightedStoke  = "3px #125B5C"
    this.errorFill = "#D32F2F"
    this.errorStroke = "3px #B71C1C"
    this.minWidth = 130
    this.minHeight = 30
    this.font = "20px Oxygen"

    this._selected = false

    this.editing = false;

    this.connections = []

    //init
    this.nodeObject = canvas.display.rectangle({
        x: this.x,
        y: this.y,
        width: this.minWidth,
        height: this.minHeight,
        origin: {x: "center", y: "center"},
        fill: this.fill,
        stroke: this.stroke,
        join: "round"
    })

    this.nodeObject.parentNode = this


    this._select = function(event) {
        if (conceptMap.selectedNode !== this.parentNode) {
            conceptMap.deselect()

            this.parentNode.normal()
            this.parentNode.selected = true
            conceptMap.selectedNode = this.parentNode
        }


        if (event) event.stopPropagation()
    }

    this.nodeObject.bind("click", this._select)

    this.nodeObject.bind("dblclick", function(event) {
        if (conceptMap.selectedNode == this.parentNode) {
            this.parentNode.edit()
        }

        event.stopPropagation()
    })

    this.nodeObject.dragAndDrop({
        changeZindex: true,
        start: this._select,
        move: function() {
            var nodeObject = this
            this.parentNode.connections.forEach(function(connection) {
                if (connection.startNode === nodeObject.parentNode) {
                    connection.start = {
                        x: nodeObject.x,
                        y: nodeObject.y
                    }
                } else if (connection.endNode === nodeObject.parentNode) {
                    connection.end = {
                        x: nodeObject.x,
                        y: nodeObject.y
                    }
                }
            })
        },
        end: function() {
            this.parentNode.x = this.x
            this.parentNode.y = this.y
        }
    })

    this.nodeObject.bind("mouseenter", function() {
        conceptMap.insideNode = this.parentNode
    })

    this.nodeObject.bind("mouseleave", function() {
        if (conceptMap.insideNode == this.parentNode)
            conceptMap.insideNode = undefined
    })

    this.textObject = canvas.display.text({
        x: 0,
        y: 0,
        origin: {x: "center", y: "center"},
        align: "center",
        font: this.font,
        text: "",
        fill: "white"
    })

    this.text = this._text

    this.nodeObject.addChild(this.textObject)

    canvas.addChild(this.nodeObject)
    canvas.redraw()
}

Node.prototype = {
    constructor: Node,

    //change the stroke when we set this.selected
    set selected(val) {
        this._selected = val

        if (this._selected) {
            this.nodeObject.stroke = this.highlightedStoke

            this.nodeObject.addChild(conceptMap.drawPoint)
            conceptMap.drawPoint.y = -this.nodeObject.height/2 - 8
            conceptMap.drawPoint.opacity = 1
        } else {
            this.nodeObject.stroke = this.stroke

            conceptMap.drawPoint.remove()
        }

        canvas.redraw()
    },

    get selected() {
        return this._selected
    },

    //automatically resize when we set text
    set text(val) {
        if (typeof val !== 'string') {
            return
        }

        this.textObject.text = val

        if (this.textObject.width > this.minWidth-20) {
            this.nodeObject.width = this.textObject.width + 20
        } else {
            this.nodeObject.width = this.minWidth
        }

        this._text = val

        canvas.redraw()

    },

    get text() {
        return this._text.trim()
    },

    //return to normal unselected state
    normal: function() {
        this.selected = false
        this.nodeObject.fill = this.fill
        this.textObject.opacity = 1
    },

    edit: function() {
        if (!conceptMap.lock) {
            this.nodeObject.stroke = "4px #FFAA00"
            this.textObject.opacity = 0
            conceptMap.editNode()
            canvas.redraw()
        }
    },

    remove: function() {
        var _parentNode = this
        this.connections.forEach(function(connection) {
            if (connection.startNode == _parentNode) {
                connection.endNode.removeConnection(connection)
            } else if (connection.endNode == _parentNode) {
                connection.startNode.removeConnection(connection)
            }
            conceptMap.removeConnection(connection)
            connection.remove()
        })
        this.nodeObject.remove()
    },


    addConnection: function(connection) {
        this.connections.push(connection)
    },

    removeConnection: function(connection) {
        var i = this.connections.indexOf(connection)

        this.connections.splice(i, 1)
    },

    error: function() {
        this.nodeObject.fill = this.errorFill
        this.nodeObject.stroke = this.errorStroke
    }
}
