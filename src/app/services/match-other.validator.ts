import { AbstractControl } from '@angular/forms';

export class CustomValidators {

    /**
     * Match two controls if they are the same
     * @param firstControlName the name of the first form control to validate
     * @param secondControlName the name of the second form control to validate
     * @returns AbstractControl if they don't match and null if they do
     */
    static Match(firstControlName: string | (string | number)[],
                 secondControlName: string | (string | number)[]): (AC: AbstractControl) => any {
        return (AC: AbstractControl) => {
            const firstControlValue = AC.get(firstControlName).value; // to get value in input tag
            const secondControlValue = AC.get(secondControlName).value; // to get value in input tag
            if (firstControlValue !== secondControlValue) {
                AC.get(secondControlName).setErrors({ MatchFields: true });
            } else {
                return null;
            }
        };
    }
}
