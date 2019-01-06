import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Category } from './pages/categories/shared/category.model';
import { Entry } from './pages/entries/shared/entry.model';

// categorias Web-Api
export class InMemoryDatabase implements InMemoryDbService {
    createDb() {
        const categories: Category[] = [
          { id: 1, name: 'Moradia', description: 'Pagamentos de Contas da Casa '},
          { id: 2, name: 'Saúde', description: 'Plano de Sáude e Remédios'},
          { id: 3, name: 'Lazer', description: 'Cinema, parques, praia, etc'},
          { id: 4, name: 'Salário', description: 'Recimento de Salário'},
          { id: 5, name: 'lazer', description: 'Trabalhos como freelancer'}

        ];

        const entries: Entry[] = [
          // tslint:disable-next-line:max-line-length
          // tslint:disable-next-line:max-line-length
          { id: 1, name: 'Gás de Cozinha', categoryId: categories[0].id, category: categories[0], paid: true, date: '14/10/2018', amount: '70,80', type: 'revenue', description: 'Qualquer descrição para essa despesa' } as unknown as Entry,
          // tslint:disable-next-line:max-line-length
          { id: 2, name: 'Suplementos', categoryId: categories[0].id, category: categories[0], paid: false, date: '14/10/2018', amount: '70,80', type: 'expense' } as unknown as Entry,
          // tslint:disable-next-line:max-line-length
          { id: 3, name: 'Salário na empresa x', categoryId: categories[0].id, category: categories[0], paid: true, date: '14/10/2018', amount: '70,80', type: 'revenue' } as unknown as Entry,
          // tslint:disable-next-line:max-line-length
          { id: 4, name: 'Aluguel de filmes', categoryId: categories[0].id, category: categories[0], paid: false, date: '14/10/2018', amount: '70,80', type: 'expense' } as unknown as Entry,
          // tslint:disable-next-line:max-line-length
          { id: 5, name: 'Suplementos', categoryId: categories[0].id, category: categories[0], paid: true, date: '14/10/2018', amount: '70,80', type: 'revenue' } as unknown as Entry,
          // tslint:disable-next-line:max-line-length
          { id: 6, name: 'Vídeo Game filha', categoryId: categories[0].id, category: categories[0], paid: false, date: '14/10/2018', amount: '70,80', type: 'expense' } as unknown as Entry,
          // tslint:disable-next-line:max-line-length
          { id: 7, name: 'Uber', categoryId: categories[0].id, category: categories[0], paid: true, date: '14/10/2018', amount: '70,80', type: 'revenue' } as unknown as Entry,

        ];

        return { categories, entries };
    }
}

