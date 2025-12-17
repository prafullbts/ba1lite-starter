export function PillBottleAnimation() {
  return (
    <div className="relative h-64 w-40 mx-auto">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-40 animate-pill-bottle-shake">
        {/* Bottle */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-40 overflow-hidden"
          style={{
            background: '#F68D2E',
            borderRadius: '0 0 10px 10px'
          }}
        >
          {/* Prescription paper (rotating inside) */}
          <div 
            className="absolute w-16 h-20 top-1/2 -translate-y-1/2 animate-pill-rotate"
            style={{
              background: '#FAF4F1',
              left: '150%'
            }}
          >
            {/* Logo circle */}
            <div 
              className="absolute rounded-full"
              style={{
                background: '#005A84',
                width: '15px',
                height: '15px',
                top: '19%',
                left: '10%'
              }}
            />
            {/* Label */}
            <div 
              className="absolute"
              style={{
                background: '#E4007C',
                width: '28px',
                height: '8px',
                top: '23%',
                left: '45%'
              }}
            />
            {/* Text lines */}
            <div className="absolute">
              <span 
                className="absolute"
                style={{
                  width: '39px',
                  height: '3px',
                  background: '#D8D8D8',
                  top: '38px',
                  left: '20px'
                }}
              />
              <span 
                className="absolute"
                style={{
                  width: '49px',
                  height: '3px',
                  background: '#D8D8D8',
                  top: '44px',
                  left: '10px'
                }}
              />
              <span 
                className="absolute"
                style={{
                  width: '49px',
                  height: '3px',
                  background: '#D8D8D8',
                  top: '50px',
                  left: '10px'
                }}
              />
              <span 
                className="absolute"
                style={{
                  width: '49px',
                  height: '3px',
                  background: '#D8D8D8',
                  top: '56px',
                  left: '10px'
                }}
              />
            </div>
          </div>
        </div>

        {/* Cap */}
        <div 
          className="absolute w-32 h-10 rounded-md"
          style={{
            background: '#FAF4F1',
            top: '12%',
            left: '50%',
            transform: 'translateX(-50%) translateY(-50%)'
          }}
        >
          {/* Cap shadow */}
          <div 
            className="absolute h-10 animate-pill-cap-shadow"
            style={{
              background: '#EAE0DB',
              width: '30px',
              right: '1.5%',
              borderRadius: '0 5px 5px 0'
            }}
          />
        </div>

        {/* Bottle shadow */}
        <div 
          className="absolute h-36 w-1.5 opacity-50"
          style={{
            background: '#E67D25',
            right: '21%',
            top: '21%'
          }}
        >
          <div
            className="absolute w-24 h-2"
            style={{
              background: '#E67D25',
              left: '-80px',
              top: '-2px',
              clipPath: 'polygon(100% 0, 0 0, 100% 100%)'
            }}
          />
        </div>
      </div>

      {/* Ground shadow */}
      <div 
        className="absolute w-32 h-1.5 rounded-full"
        style={{
          background: '#005A84',
          opacity: 0.4,
          top: '75%',
          marginTop: '40px',
          left: '50%',
          transform: 'translateX(-50%) translateY(-50%)'
        }}
      />
    </div>
  );
}
