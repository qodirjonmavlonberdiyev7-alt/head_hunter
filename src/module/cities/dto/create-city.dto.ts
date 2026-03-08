import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsString, Length, Matches } from "class-validator";
import { EnumCity } from "src/shared/constants/city";

export class CreateCityDto {
    @ApiProperty({
        enum: EnumCity,
        example: EnumCity.Tashkent
    })
    @IsEnum(EnumCity, {message: "Shahar nomi EnumCity ichidagi qiymatlardan biri bo'lishi kerak"})
    name: EnumCity;

    @ApiProperty({example: "Tashkent", description: "Viloyat nomi"})
    @IsString({message: "Region matn ko'rinishida bo'lishi kerak"})
    @IsNotEmpty({
        message: "Region bo'sh bo'lishi mumkin emas"
    })
    @Length(3,50, {
        message: "Viloyat nomi 3 dan 50 tagacha belgidan iborat bo'lishi kerak"
    })
    @Matches(/^[A-Za-z\s]+$/, {
    message: "Viloyat nomi faqat harflardan iborat bo'lishi kerak"
  })
    region: string;
}
