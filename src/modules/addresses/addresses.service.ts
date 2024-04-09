import {
  ConflictException,
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

  async findAll() {
    const addresses = await this.prisma.address.findMany();
    return addresses;
  }

  async findOne(id: string) {
    const address = await this.prisma.address.findUnique({
      where: { id: id },
      include: { person: true },
    });
    if (!address) throw new NotFoundException('Address Not Found!');

    return address;
  }

  async update(id: string, updateAddressDto: UpdateAddressDto) {
    const address = await this.prisma.address.findUnique({
      where: { id: id },
    });

    if (!address) throw new NotFoundException('Address Not Found!');

    const updatedAddress = await this.prisma.address.update({
      where: { id },
      data: { ...updateAddressDto },
    });

    return updatedAddress;
  }

  async remove(id: string) {
    const address = await this.prisma.address.findUnique({
      where: { id: id },
    });

    if (!address) throw new NotFoundException('Address Not Found!');

    await this.prisma.address.delete({ where: { id } });
  }
}
