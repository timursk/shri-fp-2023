/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */

import {
    __,
    allPass,
    equals,
    prop,
    pipe,
    compose,
    countBy,
    identity,
    dissoc,
    propEq,
    any,
    not,
    gte,
} from 'ramda';

// color comparison
const isRed = equals('red');
const isBlue = equals('blue');
const isOrange = equals('orange');
const isGreen = equals('green');
const isWhite = equals('white');
const dissocWhite = dissoc('white');

// getters
const getStar = prop('star');
const getSquare = prop('square');
const getTriangle = prop('triangle');
const getCircle = prop('circle');
const getAllShapes = Object.values;

const getOrange = prop('orange');
const getGreen = prop('green');
const twoGreens = propEq('green', 2);
const oneReds = propEq('red', 1);

// composition
const isRedStar = pipe(getStar, isRed);
const isNotRedStar = pipe(getStar, isRed, not);
const isNotWhiteStar = pipe(getStar, isWhite, not);

const isGreenSquare = pipe(getSquare, isGreen);
const isOrangeSquare = pipe(getSquare, isOrange);
const isNotWhiteSquare = pipe(getSquare, isWhite, not);

const isGreenTriangle = pipe(getTriangle, isGreen);
const isWhiteTriangle = pipe(getTriangle, isWhite);
const isNotWhiteTriangle = pipe(getTriangle, isWhite, not);

const isWhiteCircle = pipe(getCircle, isWhite);
const isBlueCircle = pipe(getCircle, isBlue);

// number comparison
const greaterOrEqualThenTwo = gte(__, 2);
const greaterOrEqualThenThree = gte(__, 3);
const greaterOrEqualThenFour = gte(__, 4);
const anyGreaterOrEqualsThenThree = any(greaterOrEqualThenThree);
const anyValueGreaterOrEqualsThenThree = compose(
    anyGreaterOrEqualsThenThree,
    getAllShapes
);

const numberOfColors = compose(countBy(identity), getAllShapes);
const numberOfColorsWithoutWhite = compose(dissocWhite, numberOfColors);
const numberOfGreenColors = compose(getGreen, numberOfColors);

// other functions
const redEqualsBlue = ({ red, blue }) => red === blue;
const squareEqualsTriangle = ({ square, triangle }) => square === triangle;
const twoGreenColors = pipe(numberOfColors, twoGreens);
const oneRedColor = pipe(numberOfColors, oneReds);

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = allPass([
    isRedStar,
    isGreenSquare,
    isWhiteTriangle,
    isWhiteCircle,
]);

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = pipe(numberOfGreenColors, greaterOrEqualThenTwo);

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = pipe(numberOfColors, redEqualsBlue);

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = allPass([
    isRedStar,
    isOrangeSquare,
    isBlueCircle,
]);

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = pipe(
    numberOfColorsWithoutWhite,
    anyValueGreaterOrEqualsThenThree
);

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
export const validateFieldN6 = allPass([
    isGreenTriangle,
    twoGreenColors,
    oneRedColor,
]);

// 7. Все фигуры оранжевые.
export const validateFieldN7 = pipe(
    numberOfColors,
    getOrange,
    greaterOrEqualThenFour
);

// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = allPass([isNotRedStar, isNotWhiteStar]);

// 9. Все фигуры зеленые.
export const validateFieldN9 = pipe(
    numberOfColors,
    getGreen,
    greaterOrEqualThenFour
);

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
export const validateFieldN10 = allPass([
    isNotWhiteSquare,
    isNotWhiteTriangle,
    squareEqualsTriangle,
]);
