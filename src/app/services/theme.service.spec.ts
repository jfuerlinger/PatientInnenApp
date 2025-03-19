import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';
import { RendererFactory2 } from '@angular/core';

describe('ThemeService', () => {
  let service: ThemeService;
  let rendererFactoryMock: jasmine.SpyObj<RendererFactory2>;
  let rendererMock: any;

  beforeEach(() => {
    rendererMock = {
      addClass: jasmine.createSpy('addClass'),
      removeClass: jasmine.createSpy('removeClass')
    };
    
    rendererFactoryMock = jasmine.createSpyObj('RendererFactory2', ['createRenderer']);
    rendererFactoryMock.createRenderer.and.returnValue(rendererMock);

    // Mock localStorage
    let store: { [key: string]: string } = {};
    spyOn(localStorage, 'getItem').and.callFake((key) => store[key] || null);
    spyOn(localStorage, 'setItem').and.callFake((key, value) => store[key] = value);

    TestBed.configureTestingModule({
      providers: [
        ThemeService,
        { provide: RendererFactory2, useValue: rendererFactoryMock }
      ]
    });
    service = TestBed.inject(ThemeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should toggle dark mode', () => {
    const initialState = service.isDarkMode();
    service.toggleDarkMode();
    expect(service.isDarkMode()).toBe(!initialState);
  });

  it('should set dark mode correctly', () => {
    service.setDarkMode(true);
    expect(service.isDarkMode()).toBe(true);
    expect(rendererMock.addClass).toHaveBeenCalledWith(document.body, 'dark-theme');
    
    service.setDarkMode(false);
    expect(service.isDarkMode()).toBe(false);
    expect(rendererMock.removeClass).toHaveBeenCalledWith(document.body, 'dark-theme');
  });
});