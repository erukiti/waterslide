'use strict'

const editorconfigText = `root = true

[*]
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true

[*.{md,js,jsx,json}]
indent_style = space
indent_size = 4
insert_final_newline = true
`

class EditorconfigGenerator {
    constructor(operator) {
        this.operator = operator
    }

    process() {

    }
    output() {
        return [
            {path: '.editorconfig', text: editorconfigText}
        ]
    }
}

module.exports = EditorconfigGenerator
