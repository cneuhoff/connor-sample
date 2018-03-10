'use strict'


const sanitizeHtml = require('sanitize-html')


module.exports = {
    cleanHtml: cleanHtml
}



function cleanHtml(data) {
    const tags = {
        allowedTags: ['font', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol',
            'nl', 'li', 'b', 'i', 'strong', 'em', 'strike', 'code', 'hr', 'br', 'div',
            'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre', 'u'],
        allowedAttributes: {
            'font': ['color', 'face'],
            'a': ['href', 'name', 'target'],
            'img': ['src']
        }
    }
    
    
    return sanitizeHtml (data, tags)
}