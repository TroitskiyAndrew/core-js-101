/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  this.width = width;
  this.height = height;
  this.getArea = () => this.width * this.height;
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const result = Object.create(proto);
  Object.assign(result, JSON.parse(json));
  return result;
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

const cssSelectorBuilder = {
  classVal: [],
  attrVal: [],
  pClassVal: [],

  element(value) {
    const result = Object.create(cssSelectorBuilder);
    Object.assign(result, this);
    if (result.elemVal) {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    if (result.idVal || result.classVal.length > 0 || result.attrVal.length > 0
      || result.pClassVal.length > 0 || result.pElemVal) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    result.elemVal = value;
    return result;
  },

  id(value) {
    const result = Object.create(cssSelectorBuilder);
    Object.assign(result, this);
    if (result.idVal) {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    if (result.classVal.length > 0 || result.attrVal.length > 0
      || result.pClassVal.length > 0 || result.pElemVal) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    result.idVal = value;
    return result;
  },

  class(value) {
    const result = Object.create(cssSelectorBuilder);
    Object.assign(result, this);
    result.classVal = [...this.classVal, value];
    if (result.attrVal.length > 0 || result.pClassVal.length > 0 || result.pElemVal) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    return result;
  },

  attr(value) {
    const result = Object.create(cssSelectorBuilder);
    Object.assign(result, this);
    result.attrVal = [...this.attrVal, value];
    if (result.pClassVal.length > 0 || result.pElemVal) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    return result;
  },

  pseudoClass(value) {
    const result = Object.create(cssSelectorBuilder);
    Object.assign(result, this);
    result.pClassVal = [...this.pClassVal, value];
    if (result.pElemVal) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    return result;
  },

  pseudoElement(value) {
    const result = Object.create(cssSelectorBuilder);
    Object.assign(result, this);
    if (result.pElemVal) {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    result.pElemVal = value;
    return result;
  },

  stringify() {
    let result = '';

    if (this.elemVal) {
      result += this.elemVal;
    }
    if (this.idVal) {
      result += `#${this.idVal}`;
    }
    if (this.classVal.length > 0) {
      result += `.${this.classVal.join('.')}`;
    }
    if (this.attrVal.length > 0) {
      result += `[${this.attrVal.join(' ')}]`;
    }
    if (this.pClassVal.length > 0) {
      result += `:${this.pClassVal.join(':')}`;
    }
    if (this.pElemVal) {
      result += `::${this.pElemVal}`;
    }

    return result;
  },

  combine(selector1, combinator, selector2) {
    return {
      stringify: () => `${selector1.stringify()} ${combinator} ${selector2.stringify()}`,
    };
  },

};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
