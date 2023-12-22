import { MigrationInterface, QueryRunner } from 'typeorm';
import { GoogleSpreadsheet } from 'google-spreadsheet'
import Question from '../domain/question.entity';
import Choice from '../domain/choice.entity';
export class SeedLearning1570200495312 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const conn = queryRunner.connection;

    const API_KEY = 'AIzaSyCRelkSzvHOcyURDoaOAWIdBlxWjtozZdU' // See: https://developers.google.com/sheets/api/guides/authorizing#APIKey
    const SHEET_ID = '1ZMTwhflJj7V-BoL4HpSuOseHWhRdynB2irzgjXrzkNs'
    const doc = new GoogleSpreadsheet(SHEET_ID)
    doc.useApiKey(API_KEY)

    await doc.loadInfo()
    const sheet = doc.sheetsByIndex[0]
    const rows = await sheet.getRows({ offset: 0, /*limit:5*/ })
    const answer = []
    for (const row of rows) {
      if(row._rowNumber === 1) continue
      const question = await conn
        .createQueryBuilder()
        .insert()
        .into(Question)
        .values({
          text: row._rawData[1]
        })
        .execute();
      for (let index = 2; index < 7; index++) {

        const element = row._rawData[index];
        if (element) {
          answer.push({
            text: element,
            question: {
              id: question.identifiers[0].id
            },
            isCorrect: element.trim() ===( row._rawData[7] || '').trim()
          })
        }

      }


    }
    await conn
      .createQueryBuilder()
      .insert()
      .into(Choice)
      .values(answer)
      .execute();

  }

  // eslint-disable-next-line
  public async down(queryRunner: QueryRunner): Promise<any> { }
}
