$(document).ready(function(){
  $('#stars li').on('mouseover', function(){
    var onStar = parseInt($(this).data('value'), 10); 

    $(this).parent().children('li.star').each(function(e){
      if (e < onStar) {
        $(this).addClass('hover');
      }
      else {
        $(this).removeClass('hover');
      }
    });
    
  }).on('mouseout', function(){
    $(this).parent().children('li.star').each(function(e){
      $(this).removeClass('hover');
    });
  });
  
  
  $('#stars li').on('click', function(){
    var onStar = parseInt($(this).data('value'), 10); 
    var stars = $(this).parent().children('li.star');
    
    for (i = 0; i < stars.length; i++) {
      $(stars[i]).removeClass('selected');
    }
    
    for (i = 0; i < onStar; i++) {
      $(stars[i]).addClass('selected');
    }
    
    var ratingValue = parseInt($('#stars li.selected').last().data('value'), 10);
    var msg = "";
    if (ratingValue > 1) {
        msg = "Thanks! You rated this " + ratingValue + " stars.";
    }
    else {
        msg = "We will improve ourselves. You rated this " + ratingValue + " stars.";
    }
    responseMessage(msg);
    
  });
  
  
});


function responseMessage(msg) {
  $('.success-box').fadeIn(200);  
  $('.success-box div.text-message').html("<span>" + msg + "</span>");
}


function handleImageSelect(e) {
  const images = e.target.files;

  for (let i = 0; i < images.length; i++) {
  
    let reader = new FileReader();

  
    reader.readAsDataURL(images[i]);


    reader.onload = () => {
      let imageInfo = {
        name: images[i].name,
        type: images[i].type,
        size: images[i].size,
        base64: reader.result,
      };

     return imageInfo;
  
    };
  }
};


$(function() {
  
  loadProducts();
 
  $("#addBtn").click(addProducts);

});

function addProducts() {
  var title = $("#title").val();
  var category = $("#category").val();
  var price = $("#price").val();
  var details = $("#details").val();
  var img = $("#img").val();
  img = handleImageSelect(img)
  $.ajax({
    url: "localhost:5000/api/products",
    method: "POST",
    data: { title, category, price, details, img },
    success: function(response) {
      console.log(response);
      $("#title").val("");
      $("#category").val("");
      $("#price").val("");
      $("#details").val("");
      $("#img").val("");
      loadProducts();
    
    }
  });
}

function loadProducts() {
  $.ajax({
    url: "localhost:5000/api/products",
    method: "GET",
    error: function(response) {
      console.log(response)
    },
    success: function(response) {
      console.log(response);
      var products = $("#products");
      products.empty();
      for (var i = 0; i < response.length; i++) {
        var rec = response[i];
        products.append(
          `<div class="col-md-3">
          <div class="ad-card">
            <img height="250" width="250" src="${rec.prImage.base64}" />
            <h5 class="text-center">${rec.prName}</h5>
            <section class='rating-widget'>
              <div class='rating-stars text-center'>
                <ul id='stars'>
                  <li class='star' title='Poor' data-value='1'>
                    <i class='fa fa-star fa-fw'></i>
                  </li>
                  <li class='star' title='Fair' data-value='2'>
                    <i class='fa fa-star fa-fw'></i>
                  </li>
                  <li class='star' title='Good' data-value='3'>
                    <i class='fa fa-star fa-fw'></i>
                  </li>
                  <li class='star' title='Excellent' data-value='4'>
                    <i class='fa fa-star fa-fw'></i>
                  </li>
                  <li class='star' title='WOW!!!' data-value='5'>
                    <i class='fa fa-star fa-fw'></i>
                  </li>
                </ul>
              </div>
              <div class='success-box' style="display: none;">
                <div class='text-message'></div>
              </div>
              
            </section>
            <h5 class="text-center price">$${rec.prPrice}</h5>
            <div class="mx-auto" style="width: 120px;"> 
              <button class="btn btn-dark mx-auto" style="width: 120px;">Add to cart</button>
            </div>
            
          </div>    
        </div>
  `
        );
        
      }
    }
  });
}
