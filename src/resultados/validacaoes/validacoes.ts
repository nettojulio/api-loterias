import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { isDefined, isEnum } from 'class-validator';

@Injectable()
export class EnumValidationPipe implements PipeTransform<string, Promise<any>> {
  constructor(private enumEntity: any) {}
  transform(value: string): Promise<any> {
    if (isDefined(value) && isEnum(value, this.enumEntity)) {
      return this.enumEntity[value];
    } else {
      const errorMessage = `O valor ${value} não é válido. Tente alguma destas opções: ${Object.keys(
        this.enumEntity,
      ).map(key => this.enumEntity[key])}`;
      throw new BadRequestException(errorMessage);
    }
  }
}
