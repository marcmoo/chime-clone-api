import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Card } from './entities/card.entity';
import { CardsService } from './cards.service';
import { CardsResolver } from './cards.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Card])],
  providers: [CardsService, CardsResolver],
  exports: [CardsService],
})
export class CardsModule {}
