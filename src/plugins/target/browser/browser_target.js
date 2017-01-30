'use strict'

class BrowserTarget {
    constructor(operator) {
        this.operator = operator
        operator.requireProvider('js')
        operator.requireProvider('document')
        operator.requireProvider('source')
        operator.requireProvider('browser_sample_source')
    }

    process() {
        const browserSampleSourceProvider = this.operator.getProvider('browser_sample_source')
        browserSampleSourceProvider.createSample('src', 'index')

        const documentProvider = this.operator.getProvider('document')
        documentProvider.setDirectory('src/', 'source code directory')

    }
}

module.exports = BrowserTarget
