import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Card } from './entities/card.entity';
import { CreateCardInput } from './dto/create-card.input';

@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(Card)
    private readonly cardsRepository: Repository<Card>,
  ) {}

  findAllByUser(userId: string): Promise<Card[]> {
    return this.cardsRepository.find({
      where: { userId },
      relations: ['account'],
    });
  }

  findById(id: string): Promise<Card | null> {
    return this.cardsRepository.findOne({
      where: { id },
      relations: ['user', 'account'],
    });
  }

  async create(userId: string, createCardInput: CreateCardInput, cardholderName: string): Promise<Card> {
    const lastFourDigits = this.generateLastFourDigits();
    const expirationDate = this.generateExpirationDate();

    const card = this.cardsRepository.create({
      userId,
      ...createCardInput,
      lastFourDigits,
      expirationDate,
      cardholderName,
    });

    return this.cardsRepository.save(card);
  }

  async blockCard(id: string): Promise<Card> {
    const card = await this.findById(id);
    if (!card) {
      throw new NotFoundException('Card not found');
    }

    card.isBlocked = true;
    return this.cardsRepository.save(card);
  }

  async unblockCard(id: string): Promise<Card> {
    const card = await this.findById(id);
    if (!card) {
      throw new NotFoundException('Card not found');
    }

    card.isBlocked = false;
    return this.cardsRepository.save(card);
  }

  async deactivateCard(id: string): Promise<Card> {
    const card = await this.findById(id);
    if (!card) {
      throw new NotFoundException('Card not found');
    }

    card.isActive = false;
    return this.cardsRepository.save(card);
  }

  private generateLastFourDigits(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  private generateExpirationDate(): string {
    const now = new Date();
    const expMonth = (now.getMonth() + 1).toString().padStart(2, '0');
    const expYear = (now.getFullYear() + 3).toString().slice(-2);
    return `${expMonth}/${expYear}`;
  }
}
