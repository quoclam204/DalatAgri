import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CatalogService } from './catalog.service';

@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get('farms')
  findFarms() {
    return this.catalogService.findFarms();
  }

  @Post('farms')
  createFarm(@Body() body: any) {
    return this.catalogService.createFarm(body);
  }

  @Patch('farms/:id')
  updateFarm(@Param('id') id: string, @Body() body: any) {
    return this.catalogService.updateFarm(id, body);
  }

  @Delete('farms/:id')
  deleteFarm(@Param('id') id: string) {
    return this.catalogService.deleteFarm(id);
  }

  @Get('plots')
  findPlots() {
    return this.catalogService.findPlots();
  }

  @Post('plots')
  createPlot(@Body() body: any) {
    return this.catalogService.createPlot(body);
  }

  @Patch('plots/:id')
  updatePlot(@Param('id') id: string, @Body() body: any) {
    return this.catalogService.updatePlot(id, body);
  }

  @Delete('plots/:id')
  deletePlot(@Param('id') id: string) {
    return this.catalogService.deletePlot(id);
  }

  @Get('crops')
  findCrops() {
    return this.catalogService.findCrops();
  }

  @Post('crops')
  createCrop(@Body() body: any) {
    return this.catalogService.createCrop(body);
  }

  @Patch('crops/:id')
  updateCrop(@Param('id') id: string, @Body() body: any) {
    return this.catalogService.updateCrop(id, body);
  }

  @Delete('crops/:id')
  deleteCrop(@Param('id') id: string) {
    return this.catalogService.deleteCrop(id);
  }

  @Get('growth-cycles')
  findGrowthCycles() {
    return this.catalogService.findGrowthCycles();
  }

  @Post('growth-cycles')
  createGrowthCycle(@Body() body: any) {
    return this.catalogService.createGrowthCycle(body);
  }

  @Get('seasons')
  findSeasons() {
    return this.catalogService.findSeasons();
  }

  @Post('seasons')
  createSeason(@Body() body: any) {
    return this.catalogService.createSeason(body);
  }

  @Patch('seasons/:id')
  updateSeason(@Param('id') id: string, @Body() body: any) {
    return this.catalogService.updateSeason(id, body);
  }

  @Delete('seasons/:id')
  deleteSeason(@Param('id') id: string) {
    return this.catalogService.deleteSeason(id);
  }
}
