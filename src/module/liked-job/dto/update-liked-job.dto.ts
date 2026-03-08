import { PartialType } from '@nestjs/mapped-types';
import { CreateLikedJobDto } from './create-liked-job.dto';

export class UpdateLikedJobDto extends PartialType(CreateLikedJobDto) {}
