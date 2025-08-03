export default class Util
{
    public static     makeRandomNumberAndQuadrant(): number {

        let x = Math.random();
        let sign = Math.random();   
        return x * (sign  <0.5 ? 1 : -1);
    }

    public static makeRandomNumber(): number {

        let x = Math.random();
         
        return x ;
    }

    public static randInt(min:number, max:number) {
        if (max === undefined) {
          max = min;
          min = 0;
        }
        return (Math.random() * (max - min) + min) | 0;
    }

    public static toDeg(rad: number) : number {
        return (rad / (Math.PI * 2))*360;
    }
    public static toRad(deg : number)  : number {
        return (deg/360) *Math.PI *2;
    }

    static toDegrees(rad: number) {
        return (rad / (Math.PI * 2))*360;
    }
    static toRadians(deg: any) : number{
        return (deg/360) *Math.PI *2;
    }
}