/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */
import {
    __,
    allPass,
    andThen,
    assoc,
    compose,
    concat,
    gt,
    ifElse,
    length,
    lt,
    mathMod,
    otherwise,
    partial,
    prop,
    tap,
    test,
} from 'ramda';
import Api from '../tools/api';

const api = new Api();

// number comparison
const greaterThenTwo = gt(__, 2);
const lowerThenTen = lt(__, 10);
const square = (num) => num ** 2;
const modForThree = mathMod(__, 3);
const thenSquare = andThen(square);

// string
const lengthGreaterThenTwo = compose(greaterThenTwo, length);
const lengthLowerThenTen = compose(lowerThenTen, length);
const testOnlyNumber = test(/^[0-9]+\.?[0-9]+$/);
const stringToRoundNumber = compose(Math.round, Number);
const thenGetLength = andThen(length);
const modForThreeString = compose(String, modForThree);
const thenModForThreeString = andThen(modForThreeString);

// validation
const validate = allPass([
    lengthGreaterThenTwo,
    lengthLowerThenTen,
    testOnlyNumber,
]);

// api
const API_NUMBERS_URL = 'https://api.tech/numbers/base';
const API_ANIMALS_URL = 'https://animals.tech/';
const apiGetNumbers = api.get(API_NUMBERS_URL);

const getApiResult = compose(String, prop('result'));
const thenGetApiResult = andThen(getApiResult);
const setNumberToApiProp = assoc('number', __, { from: 10, to: 2 });
const thenConcatToAnimalUrl = andThen(concat(API_ANIMALS_URL));
const thenCallApiGetAnimals = andThen(api.get(__, {}));
const apiGetNumber = compose(apiGetNumbers, setNumberToApiProp);

// main function
const processSequence = ({ value, writeLog, handleSuccess, handleError }) => {
    const tapLog = tap(writeLog);
    const thenTapLog = andThen(tapLog);
    const thenTapSuccess = andThen(handleSuccess);
    const otherwiseTapError = otherwise(handleError);
    const tapValidateError = partial(handleError, ['ValidationError']);

    const sequenceComposition = compose(
        otherwiseTapError,
        thenTapSuccess,
        thenGetApiResult,
        thenCallApiGetAnimals,
        thenConcatToAnimalUrl,
        thenTapLog,
        thenModForThreeString,
        thenTapLog,
        thenSquare,
        thenTapLog,
        thenGetLength,
        thenTapLog,
        thenGetApiResult,
        apiGetNumber,
        tapLog,
        stringToRoundNumber
    );

    const runWithCondition = ifElse(
        validate,
        sequenceComposition,
        tapValidateError
    );
    const logAndRunSequence = compose(runWithCondition, tapLog);
    logAndRunSequence(value);
};

export default processSequence;
