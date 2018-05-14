(window => {
    const dom = {}

    dom.createInput = function (defaultValue, className) {
        let element = document.createElement('input')
        element.value = defaultValue || ''
        element.type = 'text'
        element.className = className || ''
        return element
    }

    dom.createSelect = function (options, defaultValue) {
        let element = document.createElement('select')
        let option
        for (var label in options) {
            option = document.createElement('option')
            option.value = label
            option.innerHTML = options[label]
            if (label === defaultValue) {
                option.selected = 'selected'
            }
            element.appendChild(option)
        }
        return element
    }

    window.dom = dom
})(window)