import {
  ConflictException,
  HttpCode,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { PrismaService } from 'prisma/prisma.service';
import { Address } from './entities/address.entity';

@Injectable()
export class AddressesService {
  constructor(private prisma: PrismaService) {}

  async create(createAddressDto: CreateAddressDto, personId: string) {
    const findAdress = await this.prisma.address.findUnique({
      where: { address: createAddressDto.address },
    });

    if (findAdress) {
      throw new ConflictException('Address already exists');
    }

    const address = Object.assign(new Address(), createAddressDto);

    const newAddress = await this.prisma.address.create({
      data: {
        zipCode: address.zipCode,
        address: address.address,
        number: address.number,
        complement: address.complement,
        neighborhood: address.neighborhood,
        state: address.state,
        city: address.city,
        personId,
      },
    });

    return newAddress;
  }

  async findAll(
    page = 1,
    limit = 5,
    query?: any,
  ): Promise<{
    data: Address[];
    count: number;
    next?: string;
    previous?: string;
  }> {
    const where: any = {};
    const totalCount = await this.prisma.address.count();
    const skip = (parseInt(page.toString()) - 1) * parseInt(limit.toString());
    const take = parseInt(limit.toString());

    if (query) {
      if (query.zipCode) {
        where.zipCode = { contains: query.zipCode, mode: 'insensitive' };
      }
      if (query.neighborhood) {
        where.neighborhood = {
          contains: query.neighborhood,
          mode: 'insensitive',
        };
      }
      if (query.city) {
        where.city = { contains: query.city, mode: 'insensitive' };
      }
      if (query.state) {
        where.state = { contains: query.state, mode: 'insensitive' };
      }
    }
    const addresses = await this.prisma.address.findMany({
      where,
      skip,
      take,
    });
    const nextPage =
      skip + take < totalCount
        ? `http://localhost:3000/addresses/?page=${page + 1}`
        : null;
    const previousPage =
      page > 1 ? `http://localhost:3000/addresses/?page=${page - 1}` : null;

    return {
      count: totalCount,
      next: nextPage,
      previous: previousPage,
      data: addresses,
    };
  }

  async findOne(id: string) {
    const address = await this.prisma.address.findUnique({
      where: { id: id },
      include: { person: true },
    });
    if (!address) throw new NotFoundException('Address Not Found!');
    delete address.person.password;
    delete address.person.id;
    return address;
  }

  async update(id: string, updateAddressDto: UpdateAddressDto) {
    const address = await this.prisma.address.findUnique({
      where: { id: id },
    });

    if (!address) throw new NotFoundException('Address Not Found!');

    const addressDataEquals = Object.keys(updateAddressDto).every(
      (key) => updateAddressDto[key] === address[key],
    );

    if (addressDataEquals) {
      return address;
    }

    const updatedAddress = await this.prisma.address.update({
      where: { id },
      data: { ...updateAddressDto },
    });

    return updatedAddress;
  }

  @HttpCode(204)
  async remove(id: string) {
    const address = await this.prisma.address.findUnique({
      where: { id: id },
    });

    if (!address) throw new NotFoundException('Address Not Found!');

    await this.prisma.address.delete({ where: { id } });
  }
}
