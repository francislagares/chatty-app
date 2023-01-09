export class Helpers {
  static firstLetterUppercase(str: string): string {
    const valueString = str.toLowerCase();

    return valueString
      .split(' ')
      .map(
        (letter: string) =>
          `${letter.charAt(0).toUpperCase()}${letter.slice(1).toLowerCase()}`,
      )
      .join(' ');
  }

  static lowerCase(str: string) {
    return str.toLowerCase();
  }

  static generateRandomIntegers(integerLength: number): number {
    const characters = '0123456789';
    let result = ' ';
    const charactersLength = characters.length;
    for (let i = 0; i < integerLength; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return parseInt(result, 10);
  }

  static parseJson(prop: string): any {
    try {
      JSON.parse(prop);
    } catch (error) {
      return prop;
    }
  }
}
