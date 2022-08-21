import axios from "axios"

export default class Controller {

    constructor() {
        this.watchers = []
        this.presence = {}
        this.loopId = null
    }
    
    add(watcher) {
        this.watchers.push(watcher)
        console.log('Add watcher: ', this.watchers)
        this.trigger(watcher.identifier)
    }

    del(identifier) {
        this.watchers = this.watchers.filter(watcher => watcher.identifier !== identifier)
        console.log('Delete watcher: ', identifier, this.watchers)
    }

    loop({ 
        interval = 1000 
    }) {
        this.loopId = setInterval(() => {
            this.watchers.forEach(watcher => {
                const lastSeen = (this.presence[watcher.identifier]) ? this.presence[watcher.identifier] : null
                // check if the watcher was seen in the range of the reactionTime
                if (lastSeen && (new Date().getTime() - lastSeen) > watcher.reactionTime) {
                    // call webhook callback of watcher
                    axios.get(watcher.callback).then(resp => {
                        console.log(resp.data);
                    })
                }
            })
        }
        , interval)
    }

    trigger(identifier) {
        this.presence[identifier] = new Date().getTime()
        console.log('Trigger watcher: ', identifier, this.presence[identifier])
    }

    stopLoop() {
        clearInterval(this.loopId)
    }
}