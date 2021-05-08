/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiHideProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { BaseDTO } from './base.dto';

/**
 * A UserTeam DTO object.
 */
export class UserTeamDTO extends BaseDTO {
  @MaxLength(255)
  
  name: string;

  /**
   * id user là leader
   */
  
  leaderId: number;

  
  isDel: boolean;

  
  siteId: number;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
