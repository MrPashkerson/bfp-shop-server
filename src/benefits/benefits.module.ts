import { Module } from '@nestjs/common';
import { BenefitsController } from './benefits.controller';
import { BenefitsService } from './benefits.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Benefit } from './benefits.model';

@Module({
  imports: [SequelizeModule.forFeature([Benefit])],
  controllers: [BenefitsController],
  providers: [BenefitsService],
  exports: [BenefitsService],
})
export class BenefitsModule {}
