import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { EnumCity } from "src/shared/constants/city";

export class CreateCityDto {
    @ApiProperty({default: EnumCity.Tashkent})
    @IsString()
    name: string;

    @ApiProperty({default: "Tashkent"})
    @IsString()
    region: string;
}
