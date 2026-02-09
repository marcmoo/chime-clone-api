import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Card } from './entities/card.entity';
import { CardsService } from './cards.service';
import { CreateCardInput } from './dto/create-card.input';
import { GqlAuthGuard } from '../../common/guards/gql-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@Resolver(() => Card)
export class CardsResolver {
  constructor(private readonly cardsService: CardsService) {}

  @Query(() => [Card], { name: 'myCards' })
  @UseGuards(GqlAuthGuard)
  findAllByUser(@CurrentUser() user: User): Promise<Card[]> {
    return this.cardsService.findAllByUser(user.id);
  }

  @Query(() => Card, { name: 'card', nullable: true })
  @UseGuards(GqlAuthGuard)
  findOne(@Args('id', { type: () => ID }) id: string): Promise<Card | null> {
    return this.cardsService.findById(id);
  }

  @Mutation(() => Card)
  @UseGuards(GqlAuthGuard)
  createCard(
    @CurrentUser() user: User,
    @Args('createCardInput') createCardInput: CreateCardInput,
  ): Promise<Card> {
    return this.cardsService.create(
      user.id,
      createCardInput,
      `${user.firstName} ${user.lastName}`,
    );
  }

  @Mutation(() => Card)
  @UseGuards(GqlAuthGuard)
  blockCard(@Args('id', { type: () => ID }) id: string): Promise<Card> {
    return this.cardsService.blockCard(id);
  }

  @Mutation(() => Card)
  @UseGuards(GqlAuthGuard)
  unblockCard(@Args('id', { type: () => ID }) id: string): Promise<Card> {
    return this.cardsService.unblockCard(id);
  }

  @Mutation(() => Card)
  @UseGuards(GqlAuthGuard)
  deactivateCard(@Args('id', { type: () => ID }) id: string): Promise<Card> {
    return this.cardsService.deactivateCard(id);
  }
}
