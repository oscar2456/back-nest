import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { create } from 'domain';

@Injectable()
export class ProductsService {

  constructor(private prismaService: PrismaService) { }



  async create(createProductDto: CreateProductDto) { // Marca la función como async
    try {
      return await this.prismaService.product.create({ // Agrega await
        data: createProductDto,
      });
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException(
            `El producto con el nombre ${createProductDto.name} ya existe`,
          );
        }
      }
      throw error; // Re-lanza otros errores no manejados
    }
  }

  findAll() {
    return this.prismaService.product.findMany()
  }

  async findOne(id: number) {
    const productFoud = await this.prismaService.product.findUnique({
      where: {
        id: id
      }
    })

    if (!productFoud) {
      throw new NotFoundException(`Producto con ese id no encontrado`);
    }
    return productFoud;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    try {
      const productFound = await this.prismaService.product.update({
        where: { id },
        data: updateProductDto,
      });

      return productFound;

    } catch (error: any) {
      if (error?.code === 'P2025') {
        throw new NotFoundException(`Producto con id ${id} no encontrado`);
      }
      throw error; // Relanza cualquier otro error
    }
  }


  async remove(id: number) {
    try {
      return await this.prismaService.product.delete({
        where: { id },
      });
    } catch (error: any) {
      if (error?.code === 'P2025') {
        throw new NotFoundException(`Producto con id ${id} no encontrado`);
      }
      throw error;
    }
  }

}